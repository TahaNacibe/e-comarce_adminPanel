import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/connect';
import { Orders } from '@prisma/client';





export async function GET() {
  try {
    // Fetch all orders from the database
    const orders: Orders[] = await prisma.orders.findMany();
   
    // Return the file as a response
    return NextResponse.json({message:"data collected",orders},{status:200});
  } catch (error) {
    console.error("Error exporting orders:", error);
    return NextResponse.json({ error: "Failed to export orders" }, { status: 500 });
  }
}
