import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

const GET = async (req: Request) => {
    try {
        // Parse query parameters
        const { searchParams } = new URL(req.url);
        let page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
        const rawSearchQuery = searchParams.get("searchQuery");
        const searchQuery = rawSearchQuery === "null" || rawSearchQuery === null ? null : rawSearchQuery;

        // Calculate offset
        const offset = (page - 1) * ITEMS_PER_PAGE;
        console.log(`search for: ${searchQuery}`);

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
        console.log(`totalProductsCount: ${totalProductsCount} condition: ${searchQuery == "null"} --> ${searchQuery}`);
        const totalPages = Math.ceil(totalProductsCount / ITEMS_PER_PAGE);


        // Fetch products using offset
        const products = await prisma.products.findMany({
            include: { tags: true },
            orderBy: { createdAt: "desc" }, // Ensure consistent sorting
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
        console.error(`Error from the request: ${error.message}`, error.stack);
        return NextResponse.json(
            { message: "An error occurred while processing the request", error: error.message },
            { status: 500 }
        );
    }
};

export { GET };
