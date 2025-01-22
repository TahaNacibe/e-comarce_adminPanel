import prisma from "@/utils/connect"
import { NextRequest, NextResponse } from "next/server"



const GET = async () => { 
    try {
        //* connect to the database and get the delivery fees table
        const deliveryFees = await prisma.deliveryFee.findMany()

        //* in case no data is found
        if (!deliveryFees) {
            return NextResponse.json({message:"No delivery fees found", data: []})
        }


        //* return the delivery fees table
        return NextResponse.json({message:"Delivery fees table", data: deliveryFees})
    } catch (error) {
        return NextResponse.json({message:"An error occurred", error})
    }
}

const POST = async (req:NextRequest) => {
    try {
        //* get the data from the request body
        const  newFeeItem  = await req.json()

        if (!newFeeItem || !newFeeItem.city || !newFeeItem.price) {
            return NextResponse.json({message:"Please provide the city and price for the delivery fee"}, {status:400})
         }
        //* create a new delivery fee record
        const newFee = await prisma.deliveryFee.create({
            data: {
                city: newFeeItem.city,
                price: newFeeItem.price,
                currency: newFeeItem.currency || "DZD"
            }
        })

        //* return the new delivery fee record
        return NextResponse.json({message:"New delivery fee added", data: newFee})
    } catch (error:any) {
        return NextResponse.json({message:"An error occurred", error})
    }
}

const PUT = async (req: NextRequest) => { 
    try {
        //* get the item id from the request query
        const { searchParams } = new URL(req.url)
        const feeId = searchParams.get("id")

        //* get new data from body
        const { updatedItem } = await req.json()

        //* handle messing id state
        if(!feeId) return NextResponse.json({message:"Please provide the delivery fee id"}, {status:400})

        //* find the item with the given id
        const targetItem = await prisma.deliveryFee.findUnique({
            where: { id: feeId }
        })

        //* handle missing item state
        if (!targetItem) return NextResponse.json({ message: "Couldn't find the delivery fee record" }, { status: 404 })
        //* update item 
        await prisma.deliveryFee.update({
            where: { id: feeId },
            data: {
                city: updatedItem.city,
                price: updatedItem.price,
                currency: updatedItem.currency
            }
        })
        return NextResponse.json({ message: "Delivery fee updated" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({message:"An error occurred", error})
    }
}


const DELETE = async (req: NextRequest) => { 
    try {
        //* get the item id from the request query
        const { searchParams } = new URL(req.url)
        const feeId = searchParams.get("id")

        //* empty id state
        if (!feeId) return NextResponse.json({ message: "Please provide the delivery fee id" }, { status: 400 })

        //* find item
        const targetItem = await prisma.deliveryFee.findUnique({
            where: { id: feeId }
        })

        if (!targetItem) return NextResponse.json({ message: "Couldn't find the delivery fee record" }, { status: 404 })
        
        //* remove item if found
        await prisma.deliveryFee.delete({
            where: { id: feeId }
        })
        return NextResponse.json({ message: "Delivery fee deleted" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "An error occurred", error })
    }
}

export {GET,PUT,POST,DELETE}