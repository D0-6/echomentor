import { getNimResponse } from "@/lib/nim";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    const stream = await getNimResponse(messages);

    // Standard Web Stream for Next.js 15
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("API Chat Error:", error);
    return NextResponse.json({ error: "Failed to fetch response from NVIDIA NIM" }, { status: 500 });
  }
}
