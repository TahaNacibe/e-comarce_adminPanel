import prisma from "@/utils/connect";
import { NextResponse } from "next/server";



const GET = async () => {
    try {
        const response = await prisma.products.findMany({
            include: {
                tags: true
            }
        })
        console.log(`Response of the request is:`, JSON.stringify(response, null, 2));
        return new NextResponse(JSON.stringify({message:response, status:200}))
    } catch (error) {
        console.log(`error from the request is : ${error}`)
        return new NextResponse(JSON.stringify({message:error, status:500}))
    }
}

export {GET}