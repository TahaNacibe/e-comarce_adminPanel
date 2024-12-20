import prisma from "@/utils/connect";
import { NextResponse } from "next/server";


const GET = async () => {
    try {
        const response = await prisma.tags.findMany({
            include: {
                parentTag:true
            }
        })
        console.log("the result was : ", response)
        return new NextResponse(JSON.stringify({message:response, status:200}))
    } catch (error) {
        console.log(`error catches : ${error}`)
        return new NextResponse(JSON.stringify({message:error, status:500}))
    }
}

export {GET}