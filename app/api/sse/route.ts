// /app/api/sse/route.ts
import { NextResponse } from "next/server";
import prisma from "@/utils/connect";


//* transform the iterator turn the async generator (iterator) into a readable stream which client can use
function iteratorToStream(iterator: any) {
// read the stream 
    return new ReadableStream({
      // using the defined controller manage the stream state and working state
        async pull(controller) {
            // wait for a vale (response from the server with he data) and done (is the request response over to close)
      const { value, done } = await iterator.next();

            if (done) {
          // Close the stream when iteration is done
        controller.close(); 
            } else {
                // Send the next chunk of data
        controller.enqueue(value); 
      }
    },
  });
}

// Helper function to pause execution between updates and checks, reducing unnecessary frequent database queries
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// Async generator to fetch new orders and yield data to the stream (this will fetch the new orders and yeld (notify the stream that there's a new update to get))
let lastFetchedAt = new Date(Date.now() - 5000); // Start 5 seconds in the past
let fetchedId : string | null = null
// Optimize your iterator
async function* makeIterator() {
  let lastCheck = new Date();
  
  try {
    while (true) {
      const newOrders = await prisma.orders.findMany({
        where: { createdAt: { gt: lastCheck } },
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      
      if (newOrders.length) {
        yield `data: ${JSON.stringify(newOrders)}\n\n`;
        lastCheck = new Date(newOrders[0].createdAt);
      } else {
        yield `data: {}\n\n`;
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  } catch (error) {
    console.error('SSE Error:', error);
    yield `data: {"error": "Connection failed"}\n\n`;
  }
}

export async function GET() {
  try {
    const iterator = makeIterator();
    const stream = iteratorToStream(iterator);

    const headers = new Headers();
    headers.set("Content-Type", "text/event-stream");
    headers.set("Cache-Control", "no-cache");
    headers.set("Connection", "keep-alive");

    return new NextResponse(stream, { headers });
  } catch (error) {
    console.error("Error in SSE stream:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
