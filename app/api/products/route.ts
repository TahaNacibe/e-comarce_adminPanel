import transformData from "@/lib/transform_data";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

const GET = async (req: Request) => {
    try {
        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId")
        let page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
        const productsOrder: any = searchParams.get("productsAreInDescOrder") || "desc"
        const rawSearchQuery = searchParams.get("searchQuery");
        const searchQuery = rawSearchQuery === "null" || rawSearchQuery === null ? null : rawSearchQuery;


        //* get single product data
        if (productId) {
            // get the product by the id
            const productData = await prisma.products.findUnique({
                where: {
                    id: productId
                },
                include: {
                    tags:true
                }
            })

            // return the details
            return NextResponse.json(
                {
                    message: productData,
                    status: 200,
                },
                { status: 200 }
            );
        }



        // Calculate offset
        const offset = (page - 1) * ITEMS_PER_PAGE;

        // Fetch total products count
        const totalProductsCount = searchQuery === "" || searchQuery === null
            ? await prisma.products.count()
            // get items count for the search
            : await prisma.products.count({
                where: {
                    name: {
                        contains: searchQuery,
                        mode: "insensitive"
                    }
                }
            });
        const totalPages = Math.ceil(totalProductsCount / ITEMS_PER_PAGE);


        // Fetch products using offset
        const products = await prisma.products.findMany({
            include: { tags: true },
            orderBy: { createdAt: productsOrder }, // Ensure consistent sorting
            take: ITEMS_PER_PAGE,
            skip: offset,
            where: searchQuery ? {
                name: {
                    contains: searchQuery,
                    mode: "insensitive"
                }
            } : undefined,
        });

        return NextResponse.json(
            {
                message: products,
                totalPages,
                totalProductsCount,
                currentPage: page,
                status: 200,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "An error occurred while processing the request", error: error.message },
            { status: 500 }
        );
    }
};


const DELETE = async (req: Request) => { 
    try {
        // Parse product ID from URL
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        // Validate product ID
        if (!productId) {
            return NextResponse.json(
                { message: "Product ID is required" },
                { status: 400 }
            );
        }

        // Delete product from database
        const deletedProduct = await prisma.products.delete({
            where: {
                id: productId,
            },
        });

        return NextResponse.json(
            { message: deletedProduct.id },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "An error occurred while processing the request", error: error.message },
            { status: 500 }
        );
        
    }
}


//* POST method to create a new product or duplicate an existing product
const POST = async (req: Request) => {
    try {
        // Parse product ID from URL
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        // Validate product ID ---> Duplicate process
        if (productId) {
            // if product id is served duplicate item
            const product = await prisma.products.findUnique({
                where: {
                    id: productId,
                },
            });


            // if no product was found then exit with error
           if(!product) return NextResponse.json(
            { message: "Product ID required" },
            { status: 400 }
        ); 
            
               const { id, createdAt, updatedAt, ...rest } = product;
            
            const duplicatedItem =  await prisma.products.create({
                data: {
                    ...rest,
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now()),
                },
            })
           
            return NextResponse.json(
                { message: "Product Duplicated", product:duplicatedItem },
                { status: 200 }
            );
            
        }


        
        // new product section code
            // get formdata
            const { rest, bigImageUrl, smallImageUrls } = await req.json()

            // images have been edited before sent and replaced with urls
            const newProduct = await prisma.products.create({
                data:transformData(rest,bigImageUrl,smallImageUrls)
            })

            // return result
            return NextResponse.json(
                { message: "Product created", product:newProduct},
                { status: 200 }
            );


    } catch (error: any) {
        return NextResponse.json(
            { message: "error", error:error },
            { status: 500 }
        );
    }
}


const PUT = async (req: Request) => {
    try {
        // Get the edited product id from the query parameters
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        // In case no ID was provided
        if (!productId) 
            return NextResponse.json(
                { message: "Product ID required" },
                { status: 400 }
            );

        // Parse the request body (e.g., JSON payload) for updated product data
        const body = await req.json();

        // Validate the body for the fields you need to update
        if (!body || Object.keys(body).length === 0) 
            return NextResponse.json(
                { message: "No data provided for update" },
                { status: 400 }
            );

        // Fetch the existing product
        const existingProduct = await prisma.products.findUnique({
            where: {
                id: productId,
            },
        });

        // If no product was found with that ID, return an error
        if (!existingProduct)
            return NextResponse.json(
                { message: "No product found with that ID" },
                { status: 404 }
            );
        
        const {id,tags, ...rest} = body
        
        // Update the product with the new data
        const updatedProduct = await prisma.products.update({
            where: { id: productId },
            include: {tags: true},
            data: {
                ...rest, // Spread the updated fields from the request body
                updatedAt: new Date(), // Optionally update the timestamp
            },
        });

        // Return the updated product
        return NextResponse.json(
            { message: "Product updated successfully", product: updatedProduct },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "An error occurred while processing the request", error: error.message },
            { status: 500 }
        );
    }
};


export { GET,DELETE,POST,PUT };
