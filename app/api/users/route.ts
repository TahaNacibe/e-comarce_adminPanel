import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

const GET = async () => {
    try {
        // Fetch users from the database
        const users = await prisma.user.findMany();
        // Send a successful response with the users list
        return new NextResponse(
            JSON.stringify({ message: users }),
            { status: 200 }
        );
    } catch (error) {
        // Check if error is an object or string to avoid null/undefined
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

        // Log the error stack for debugging (if error is an object)
        if (error instanceof Error) {
            console.error("The error stack was:", error.stack);
        } else {
            console.error("The error was:", errorMessage);
        }

        // Return an error response with the message
        return new NextResponse(
            JSON.stringify({ message: errorMessage }), 
            { status: 500 }
        );
    }
}

export { GET };
