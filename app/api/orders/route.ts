import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

const GET = async (req: NextRequest) => {
    //* Get search params
    const { searchParams } = new URL(req.url);
    const pageIndex = parseInt(searchParams.get("pageIndex") || "1");
    const searchQuery = searchParams.get("searchQuery") || "";
    const filterKey = searchParams.get("filterKey");
    const verifyState = searchParams.get("verifyState")
    
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

        // Transform dates to ISO string for JSON serialization
        const serializedOrders = orders.map(order => ({
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

export { GET };
