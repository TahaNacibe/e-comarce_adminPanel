import prisma from "@/utils/connect";
import { shopPreferences } from "@prisma/client";
import Email from "next-auth/providers/email";
import { NextRequest, NextResponse } from "next/server";



const GET = async (req: NextRequest) => {
    try {
        //* check if search exist 
        const { searchParams } = new URL(req.url)
        const searchQuery = searchParams.get("searchQuery")
        console.log(searchQuery)

        if (searchQuery) {
            //* preform search for a user by name or email
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { 
                    name: { contains: searchQuery },
                        },
                        { 
                    email: { contains: searchQuery },
                        }
                    ],
                    AND: [
                        { role: { notIn: ["ADMIN", "SUB_ADMIN", "DEVELOPER"] } },
                    ]
                }
            })

            return NextResponse.json({message:"Users list loaded",users},{status:200})
        }

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {role:"ADMIN"},
                    {role:"SUB_ADMIN"},
                    {role:"DEVELOPER"},
                ]
            },
        })
        return NextResponse.json({message:"Users list loaded",users},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Users list failed to load",error},{status:500})
    }
}


const PUT = async (req: NextRequest) => {
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")

        if (!userId) return NextResponse.json({ message: "require user id to update" }, { status: 400 })
        const targetUser = await prisma.user.findUnique({
            where:{id:userId}
        })
        if (!targetUser) return NextResponse.json({ message: "couldn't find the targeted user" }, { status: 404 })
        
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                role: targetUser.role === "SUB_ADMIN"? "USER" : "SUB_ADMIN"
            }
        })

        return NextResponse.json({message:"User updated",updatedUser},{status:200})
        
    } catch (error) {
        return NextResponse.json({ message: "Error updating user",error }, { status: 500 })
    }
}



const POST = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const newName = searchParams.get("newName");
        const newIcon = searchParams.get("newIcon");

        if (!newName && !newIcon) {
            return NextResponse.json(
                { message: "Require at least one parameter" },
                { status: 400 }
            );
        }

        // Check if a shop exists
        const shop = await prisma.shopPreferences.findFirst();

        if (shop) {
            // Shop exists, update it
            const updatedShop = await prisma.shopPreferences.update({
                where: {
                    shopId: "0"
                },
                data: {
                    ...(newName && { shopName: newName }),
                    ...(newIcon && { shopIcon: newIcon }),
                },
            });

            return NextResponse.json(
                { message: "Shop details updated", shop: updatedShop },
                { status: 200 }
            );
        } else {
            // No shop exists, create a new one
            const shop: shopPreferences = {
                shopId: "0",
                shopName: newName || "Default Name", 
                shopIcon: newIcon || "default-icon.png", }
            const newShop = await prisma.shopPreferences.create({
                data: shop,
            });

            return NextResponse.json(
                { message: "Shop created", shop: newShop },
                { status: 201 }
            );
        }
    } catch (error:any) {
        return NextResponse.json(
            { message: "Error handling shop data", error: error.message },
            { status: 500 }
        );
    }
};


export {GET,PUT,POST}