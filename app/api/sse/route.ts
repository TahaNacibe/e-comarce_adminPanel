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
async function* makeIterator() {
  console.log("SSE connection opened successfully.");
  while (true) {
    try {
      const newOrders = await prisma.orders.findMany({
        where: {
          createdAt: { gt: lastFetchedAt }, // Orders created after the last fetched time
        },
      });
      console.log("New orders received:", newOrders);

      if (newOrders.length > 0) {
        if (newOrders[newOrders.length - 1].id !== fetchedId) {
          yield `data: ${JSON.stringify(newOrders)}\n\n`; // SSE data format
          lastFetchedAt = new Date(newOrders[newOrders.length - 1].createdAt);
          fetchedId = newOrders[newOrders.length - 1].id;
        } else {
          yield `data: {}\n\n`;
        }
      } else {
        yield `data: {}\n\n`;
      }
    } catch (error) {
      console.error("Error fetching new orders:", error);
      yield `data: { "error": "Failed to fetch orders" }\n\n`;
    }

    await sleep(5000); // Wait 5 seconds before checking again
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
