import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image, imageUrl, prompt, apiKey, systemPrompt } = await req.json();
    const finalImageUrl = image || imageUrl;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing NVIDIA API Key" }, { status: 400 });
    }

    if (!finalImageUrl || !prompt) {
      return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "meta/llama-3.2-11b-vision-instruct",
        messages: [
          { role: 'system', content: systemPrompt || "You are a helpful assistant." },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url: finalImageUrl },
              },
            ],
          },
        ],
        max_tokens: 512,
      });
    } catch (e: any) {
      if (e.status === 403 || e.status === 404) {
        throw new Error("This AI feature (Vision) is restricted for your API key. Please try a standard text message or refresh your NVIDIA key.");
      }
      throw e;
    }

    return NextResponse.json({ analysis: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("API Vision Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze image with NVIDIA NIM" }, { status: 500 });
  }
}
