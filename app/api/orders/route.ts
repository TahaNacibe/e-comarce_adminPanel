import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

const GET = async () => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                // Include user details
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'  // Most recent orders first
            }
        });

        // Transform dates to ISO string for JSON serialization
        const serializedOrders = orders.map(order => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString()
        }));


        console.log("result was : ",orders)
        return new NextResponse(
            JSON.stringify({
                message: "Orders fetched successfully",
                data: serializedOrders,
                status: 200
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(`"Error fetching orders:", ${error}`);
        return new NextResponse(
            JSON.stringify({
                message: "Failed to fetch orders",
                error: error instanceof Error ? error.message : "Unknown error",
                status: 500
            }),
            { status: 500 }
        );
    }
};

export { GET };