import { getNimVisionResponse } from "@/lib/nim";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.NVIDIA_NIM_API_KEY) {
      console.error("FATAL: NVIDIA_NIM_API_KEY is not set in environment variables")
      return NextResponse.json({ error: "Server configuration error: AI service key is missing." }, { status: 500 });
    }

    const { image, imageUrl, prompt } = await req.json();
    const finalImageUrl = image || imageUrl;

    if (!finalImageUrl || !prompt) {
      return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
    }

    // Ensure it's a valid data URL for NIM
    const formattedUrl = finalImageUrl.startsWith("data:") 
      ? finalImageUrl 
      : `data:image/jpeg;base64,${finalImageUrl}`;

    const analysis = await getNimVisionResponse(formattedUrl, prompt);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("API Vision Error:", error);
    return NextResponse.json({ error: "Failed to analyze image with NVIDIA NIM" }, { status: 500 });
  }
}
