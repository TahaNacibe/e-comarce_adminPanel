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
            // Fetch orders created after the last fetched time
            const newOrders = await prisma.orders.findMany({
              where: {
                createdAt: { gt: lastFetchedAt }, // Orders created after the last fetched time
              },
            });
      
            console.log("New orders received:", newOrders);
        if (newOrders.length > 0) {
            if (newOrders[newOrders.length - 1].id !== fetchedId) {
                yield `data: ${JSON.stringify(newOrders)}\n\n`; // SSE data format
          
                // Update the last fetched time to the most recent order
                  lastFetchedAt = new Date(newOrders[newOrders.length - 1].createdAt);
                  fetchedId = newOrders[newOrders.length - 1].id
                }
        }
  
  
      await sleep(5000); // Wait 5 seconds before checking again
    }
  }
  

export async function GET() {
  //start the checking and notifying process when the client send the first request 
    const iterator = makeIterator();
    // pause as we said before
  const stream = iteratorToStream(iterator);

  // headers defy the way the connection is going to be (sent only once at the start of the pipe)
    const headers = new Headers();
  // the received content type as stream (json string)
    headers.set("Content-Type", "text/event-stream");
    // don't cache return everything
    headers.set("Cache-Control", "no-cache");
    // keep connection alive all the time until the client said to close
  headers.set("Connection", "keep-alive");

    
 // return the stream
  return new NextResponse(stream, { headers });
}
