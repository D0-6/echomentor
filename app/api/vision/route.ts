import { getNimVisionResponse } from "@/lib/nim";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl, prompt } = await req.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
    }

    const result = await getNimVisionResponse(imageUrl, prompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API Vision Error:", error);
    return NextResponse.json({ error: "Failed to analyze image with NVIDIA NIM" }, { status: 500 });
  }
}
