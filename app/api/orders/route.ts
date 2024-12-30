import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

const GET = async (req: NextRequest) => {
    //* Get search params
    const { searchParams } = new URL(req.url);
    const pageIndex = parseInt(searchParams.get("pageIndex") || "1");
    const searchQuery = searchParams.get("searchQuery") || "";
    const filterKey = searchParams.get("filterKey");
    
    const pageSize = 20; 
    //* Calculate pagination offset
    const offset = (pageIndex - 1) * pageSize;

    //* Build filters dynamically
    const filters: any = {};

    // Apply search query if provided
    if (searchQuery) {
        filters.OR = [
            {
                name: {
                    contains: searchQuery,
                    mode: "insensitive", // Case-insensitive search
                },
            },
            {
                email: {
                    contains: searchQuery,
                    mode: "insensitive", // Case-insensitive search
                },
            },
        ];
    }

    // Apply filterKey logic
    if (filterKey) {
        switch (filterKey) {
            case "Completed":
                filters.status = "COMPLETED";
                break;
            case "Pending":
                filters.status = "PENDING";
                break;
            case "Canceled":
                filters.status = "CANCELED";
                break;
            case "Verified":
                filters.verified = true;
                break;
            case "UnVerified":
                filters.verified = false;
                break;
            default:
                break; // No additional filter
        }
    }

    //* Fetch data
    try {

        const [
            totalItems,
            totalCompletedOrders,
            totalPendingOrders,
            totalCanceledOrders,
            totalUnverifiedOrders
        ] = await Promise.all([
            prisma.orders.count({ where: filters }),
            prisma.orders.count({ where: { status: "COMPLETED" } }),
            prisma.orders.count({ where: { status: "PENDING" } }),
            prisma.orders.count({ where: { status: "CANCELED" } }),
            prisma.orders.count({ where: { verified: false } }),
        ]);
    
        const totalVerifiedOrders = totalItems - totalUnverifiedOrders;

        //* count pages for the items
        const pagesCount = Math.ceil(totalItems/pageSize)

        //* get page items
        const orders = await prisma.orders.findMany({
            where: filters,
            orderBy: {
                createdAt: "desc", // Most recent orders first
            },
            skip: offset,
            take: pageSize,
        });

        const productIds = orders.flatMap(order => order.orderMetaData.productsMetaDataList.map(product => product.productId));
        // Fetch products in bulk to get images and properties
        const products = await prisma.products.findMany({
            where: {
            id: {
                in: productIds,
            }
            },
            select: {
            id: true,
            bigImageUrl: true,
            properties: true
            }
        });
        // Map the images to their respective orders
        const ordersWithImages = orders.map(order => {
            // Map product image to each order based on productId
            const productsWithImage = order.orderMetaData.productsMetaDataList.map(productMetadata => {
            const product = products.find(p => p.id === productMetadata.productId);
            return {
                ...productMetadata,
                productImage: product ? product.bigImageUrl : "image_placeholder.jpg", // Attach the image
                productProperties: product ? product.properties : null
            };
            });
        
            return {
            ...order,
            orderMetaData: {
                ...order.orderMetaData,
                productsMetaDataList: productsWithImage,
            },
            };
        });

        // Transform dates to ISO string for JSON serialization
        const serializedOrders = ordersWithImages.map(order => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
        }));

        //* Return the data
        return new NextResponse(
            JSON.stringify({
                message: "Orders fetched successfully",
                data: serializedOrders,
                pageIndex,
                totalItems,
                totalCanceledOrders,
                totalCompletedOrders,
                totalPendingOrders,
                totalUnverifiedOrders,
                totalVerifiedOrders,
                pagesCount: pagesCount,
                status: 200,
            }),
            { status: 200 }
        );
    } catch (error:any) {
        console.error(`Error fetching orders:`, error.toString());
        return new NextResponse(
            JSON.stringify({
                message: "Failed to fetch orders",
                error: error instanceof Error ? error.message : "Unknown error",
                status: 500,
            }),
            { status: 500 }
        );
    }
};



const DELETE = async (req: NextRequest) => {
    try {
      //* Get search params and order id
      const { searchParams } = new URL(req.url);
      const orderId = searchParams.get("orderId");
      const ordersListIds = searchParams.get("ordersListIds");
  
      // Check if order id or ordersListIds exists
      if (!orderId && !ordersListIds) {
        return NextResponse.json({ message: "Require Order Id for delete" }, { status: 400 });
      }
  
      // Single order deletion
        if (orderId) {
          console.log("--------------------> ")
        // Check if the target order exists
        const targetForDelete = await prisma.orders.count({
          where: { id: orderId },
        });
  
        // Handle case where the order does not exist
        if (targetForDelete === 0) {
          return NextResponse.json({ message: "Can't Find The Order Item" }, { status: 404 });
        }
  
        // Delete the target order
        await prisma.orders.delete({
          where: { id: orderId },
        });
  
            // Return success message
        return NextResponse.json({ message: "Order Deleted!" }, { status: 200 });
      }
  
      // Bulk delete
      const ordersIds = ordersListIds?.split("_") || [];
      if (ordersIds.length === 0) {
        return NextResponse.json({ message: "Require valid order ids" }, { status: 400 });
      }
  
      // Check if all provided order ids exist
      const targetForDelete = await prisma.orders.count({
        where: { id: { in: ordersIds } },
      });
  
      // In case of mismatch (some ids not found)
      if (targetForDelete !== ordersIds.length) {
        return NextResponse.json({ message: "Couldn't find some of the orders selected" }, { status: 400 });
      }
  
      // Proceed with deleting the orders
      const deletedItems = await prisma.orders.deleteMany({
        where: { id: { in: ordersIds } },
      });
  
      return NextResponse.json({ message: `${deletedItems.count} Orders Deleted!` }, { status: 200 });
    } catch (error:any) {
      // Log the error for debugging (if in production, use proper logging)
      console.error("Error during deletion:", error);
      return NextResponse.json({ message: "Error occurred while deleting", error: error.message }, { status: 500 });
    }
};
  


const PUT = async (req: NextRequest) => {
    try {
        console.log("stop 0")
        //* get params
        const { searchParams } = new URL(req.url)
        const orderId = searchParams.get("orderId")
        const isUpdateVerification = searchParams.get("updateVerification")

        // get the updated order
        console.log("stop 1")
        
        //* toggle state action
        if (isUpdateVerification) {
            if (!orderId) return NextResponse.json({message:"Require Order iD"},{status:400})
            //* get the element
            const item = await prisma.orders.findUnique({
                where: { id: orderId },
                select: { verified: true }, // Fetch only the boolean field
            });
            
            if(!item) return NextResponse.json({message:"No Order with that id"},{status:404})

            await prisma.orders.update({
                where: {
                    id:orderId
                },
                data: {
                    verified:!item?.verified
                }
            })

            return NextResponse.json({message:"Verification state updated!"},{status:200})
        }


        console.log("stop 2")
        //* update a whole order
        const { newOrder } = await req.json()
        console.log("stop 3 ",newOrder)
        const updateOrderId = newOrder.id;
        if(!updateOrderId) return NextResponse.json({message:"No Order Id received"},{status:400})
        const updateTargetOrder = await prisma.orders.findUnique({
            where: {
                id:updateOrderId
            }
        })

        if(!updateTargetOrder) return NextResponse.json({message:"No Order with that Id found"},{status:404})

        console.log("reached deep enough")
        const { id, ...rest } = newOrder
        console.log("---------------> ",id,rest)
        const updatedOrder = await prisma.orders.update({
            where: { id: updateOrderId },
            data:rest
        })

        return NextResponse.json({message:"Order updated!",updatedOrder},{status:200})
    } catch (error:any) {
        console.log(error.toString())
        return NextResponse.json({message:"Something went wrong updating the order info"},{status:500})
    }
}
  
export { GET,DELETE,PUT };
