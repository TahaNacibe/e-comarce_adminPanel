import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

const GET = async () => {
  try {
    //* Get products-related statistics
    const orderedProducts = await prisma.orders.findMany({
      select: {
        orderMetaData: true,
      },
    });


    // Aggregating the ordered products data
    const productCounts: Record<string, number> = {};
    orderedProducts.forEach((order) => {
      order.orderMetaData.productsMetaDataList.forEach((product) => {
        if (productCounts[product.productName]) {
          productCounts[product.productId] += product.quantity;
        } else {
          productCounts[product.productId] = product.quantity;
        }
      });
    });

    const productsData = await prisma.products.findMany({
      where: { id: { in: Object.keys(productCounts) } },
      select: {
        name: true,
        bigImageUrl: true,
        price: true
      }
    })

    //* Get tags-related statistics
    const categoriesUsed = await prisma.products.findMany({
      select: {
        tagIds: true,
        tags: true,
      },
    });

    // Aggregating the tags data
    const tagCounts: Record<string, number> = {};
    categoriesUsed.forEach((product) => {
      product.tagIds.forEach((tagId) => {
        if (tagCounts[tagId]) {
          tagCounts[tagId] += 1;
        } else {
          tagCounts[tagId] = 1;
        }
      });
    });


    const tagsData = await prisma.tags.findMany({
      where: { id: { in: Object.keys(tagCounts) } },
      include: {
        parentTag:true
      }
    })

    //* Get orders with time
    const ordersWithTime = await prisma.orders.findMany({
      select: {
        id: true,
        createdAt: true,
      },
    });

    // Aggregating orders by time (e.g., per day)
    const ordersByTime: Record<string, number> = {};
    ordersWithTime.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString(); // Format date as "MM/DD/YYYY"
      if (ordersByTime[date]) {
        ordersByTime[date] += 1;
      } else {
        ordersByTime[date] = 1;
      }
    });

    // Example of how you might return the data
    return NextResponse.json({message:"Data collection completed", productCounts, productsData,tagsData,
      tagCounts, 
      ordersByTime, },{status:200});
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({message:"Failed to get statics",error},{status:500})
  }
};

export  {GET};
