import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "Missing NVIDIA API Key" }, { status: 400 });
    }

    if (!messages) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    // TRY-CATCH for the stream creation to handle fallback
    let stream;
    try {
      stream = await openai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages,
        temperature: 0.6,
        max_tokens: 500,
        stream: true,
      });
    } catch (e: any) {
      if (e.status === 403 || e.status === 404) {
        console.log("70B Model failed or forbidden. Trying 8B fallback...");
        stream = await openai.chat.completions.create({
          model: "meta/llama-3.1-8b-instruct",
          messages,
          temperature: 0.6,
          max_tokens: 500,
          stream: true,
        });
      } else {
        throw e;
      }
    }

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
  } catch (error: any) {
    console.error("API Chat Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch response from NVIDIA NIM" }, { status: 500 });
  }
}
