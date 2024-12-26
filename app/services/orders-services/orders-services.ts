import createRecept from "@/lib/recipet_creator";
import { Orders } from "@prisma/client";
import exportFromJSON from "export-from-json";

export default class OrderServices {


    //* get orders with pagination setting
    getOrdersListFromDb = async (pageIndex:number,searchQuery?:string | null,filterKey?:string | null) => {
        try {
            //* check params exist
            if (!pageIndex || pageIndex <= 0) return { success: false, message: "Require a page to get the orders", data: "No Page Supplied" }
            
            // handle request
            const queryParams = new URLSearchParams();
            queryParams.append("pageIndex", pageIndex.toString());
            if (searchQuery) queryParams.append("searchQuery", searchQuery);
            if (filterKey) queryParams.append("filterKey", filterKey);

            const response = await fetch(`/api/orders?${queryParams.toString()}`, { method: "GET" });


            const data = await response.json()
            // handle response
            if (response.ok) {
                return {success:true, message:"Orders List loaded!",data:data,}
            }

            //* other wise handle error
            return {success: false, message:data.message, data:data.data}
        } catch (error:any) {
            return {success: false, message:"Error fetching orders!", data:error.message}
        }
    }


    //* get orders stream 
    getOrdersListStream = async (setOrdersList:any) => {
            const eventSource = new EventSource("/api/sse")
            eventSource.onmessage = (event) => {
                let newOrders = JSON.parse(event.data) as Orders[]
                setOrdersList((prevOrders: Orders[]) => [...newOrders,...prevOrders])
                }
          
              eventSource.onerror = (error:any) => {
                console.error("SSE error:", error)
                eventSource.close()
              }
          
              // Cleanup when component unmounts
              return () => {
                eventSource.close()
              }

    }


    //* delete item or many items from db
    handleDeletingOrderOrManyOrdersFromDb = async ({ orderId, ordersList }: { orderId?: string | null, ordersList?: any | null }) => {
        console.log("  items case")
        console.log(ordersList)
        const queryParams = new URLSearchParams()
        //* if order is is served
        if (orderId) queryParams.append("orderId", orderId)
        console.log("---------------------->")
        //* if orders list is served
        if (ordersList) {
            console.log(" list items case")
            // create a list of ids
            const ordersIdsString = Array.from(ordersList).join("_")
            console.log(ordersIdsString)
            queryParams.append("ordersListIds",ordersIdsString)
        }

        // actual request
        try {
            // request delete
            const response = await fetch(`/api/orders?${queryParams.toString()}`, {
                method:"DELETE"
            })

            const data = await response.json()
            if (response.ok) {
                return {success:true, message:data.message}
            }

            return {success:false, message:data.message}
        } catch (error: any) {
            console.log(error)
            return {success:false, message:error.message}
        }
    }


    //* update the verification state for the order
    updateVerificationStateForOrder = async ({ orderId }: { orderId: string}) => {
        try {
            //* check if prams are served
            if (!orderId) return { success: false, message: "Missing Required Field id" }
            const response = await fetch(`/api/orders?orderId=${orderId}&updateVerification=${true}`, {
                method: "PUT",
            })

            const data = await response.json()
            if (response.ok) {
                return {success:true,message:"Order Updated"}
            }
            return {success:false, message:data.message}
        } catch (error:any) {
            return {success:false, message:error.message}
        }
    }


    //* update orders info
    updateOrderDetailsInDb = async (newOrder:Orders) => {
        try {
            //* update directly
            const updateResponse = await fetch("/api/orders", {
                method: "PUT",
                body:JSON.stringify({newOrder:newOrder})
            })

            const data = await updateResponse.json()
            if (updateResponse.ok) {
                return {success:true, message:"Order Updated!",data:data.updatedOrder}
            }

            return {success:false, message:"Update Failed!",data:data.message}
        } catch (error:any) {
            return {success:false, message:"Error while updating!",data:error.message}
        }
    }




    getFileType = (extension:string) => {
      if (extension === "excel") {
        return exportFromJSON.types.csv
      } else if (extension === "text") {
        return exportFromJSON.types.txt
      } else {
        return exportFromJSON.types.json
      }
    }

    //* export orders 
    exportOrdersAsFile= async (fileExtension:string) => {
        try {
            const response = await fetch(`/api/orders/export_file`, {
                method:"GET"
            })
            
            if (response.ok) {
                const data = await response.json();
const formattedData = data.orders.map((order: Orders) => {
  const { orderMetaData, ...rest } = order;
  const { totalPrice, currency, productsMetaDataList } = orderMetaData;

  // Flatten productsMetaDataList into a more suitable structure
  const productsMetaData = productsMetaDataList.map((product, index) => ({
    [`Product ${index + 1} id`]: product.productId,
    [`Product ${index + 1} name`]: product.productName,
    [`Product ${index + 1} quantity`]: product.quantity,
    [`Product ${index + 1} unitPrice`]: product.unitePrice,
  }));

  // Flatten productsMetaData and add them to the rest of the order data
  const flattenedOrder = {
    ...rest, // Order details
    totalPrice, // Order total price
    currency, // Currency of the order
    ...Object.assign({}, ...productsMetaData), // Flatten productsMetaData into the order
  };

  return flattenedOrder;
});


                // my data
                    const fileName = "OrdersRecord"
                    const exportType = this.getFileType(fileExtension)
                 if (fileExtension === "excel") {
                    const file = exportFromJSON({data:formattedData,fileName,exportType})
                } else {
                    const file = exportFromJSON({data:formattedData,fileName,exportType})
                    
                }
               
                return {success:true, message:`Download orders.${fileExtension}...`,data:response.url}
            }
        } catch (error: any) {
            console.log(error.message)
            return {success:false, message:`Couldn't download orders.${fileExtension}!...`,data:error.message}
        }
    }


    createRecipeForOrder = (order: Orders) => {
        const recipe = createRecept({ clientName:order.name,
            totalPrice:order.orderMetaData.totalPrice,
            createdAt:order.createdAt,
            productsData: order.orderMetaData.productsMetaDataList.map((product) => ({
                productName: product.productName,
                productCount: product.quantity,
                productTotal: product.unitePrice * product.quantity,
                productPrice: product.unitePrice,
            })),
            fullAddress: `${order.city} ${order.postalCode} ${order.address} N-${order.houseNumber}`,
        })
        
        const fileName = `recipe for ${order.name}`
        const exportType = exportFromJSON.types.txt
        const file = exportFromJSON({data:recipe,fileName,exportType})
    }


}