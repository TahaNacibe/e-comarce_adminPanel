import prisma from "@/utils/connect"
import { NextResponse } from "next/server"



const GET = async () => {
    try {
        let settings = await prisma.shopPreferences.findUnique({
            where: {
                shopId:"0"
            }
        })

        if (!settings) {
            settings  = {
                shopId: "0",
                shopName:  "Default Name", 
                shopIcon: "image_placeholder.jpg",
                TikTokLink: null,
                facebookLink: null,
                instagramLink: null,
                phoneNumber: "",
                email: "",
                address:"" }
        }
        return NextResponse.json({message:"Loaded",settings},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Error loading details",error},{status:500})
    }
}

export {GET}