// // /app/api/sse/route.ts
// import { NextResponse } from "next/server"
// import prisma from "@/utils/connect"

// export async function GET() {
//   // Set headers for SSE
//   const headers = new Headers()
//   headers.set("Content-Type", "text/event-stream")
//   headers.set("Cache-Control", "no-cache")
//   headers.set("Connection", "keep-alive")

//   // Create a stream to send data to the client
//     const stream = new ReadableStream({
//     start(controller) {
//       let intervalId: NodeJS.Timeout

//       // Helper function to send new orders to client
//       const newOrderListener = async () => {
//         // Simulate checking for new orders created in the last minute
//         const newOrder = await prisma.orders.findFirst({
//           where: {
//             createdAt: { gt: new Date(Date.now() - 1000 * 60) }, // orders created in the last minute
//           },
//         })

//         if (newOrder) {
//           controller.enqueue(`data: ${JSON.stringify(newOrder)}\n\n`)
//         }
//       }

//       // Send updates every 5 seconds (simulating polling)
//       intervalId = setInterval(newOrderListener, 5000)

//       // Cleanup interval when the stream is closed
//       controller.close = () => {
//         clearInterval(intervalId)
//       }
//     },
//   })

//   return new NextResponse(stream, { headers })
// }
