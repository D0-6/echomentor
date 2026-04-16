import OpenAI from 'openai';

// This file only runs on the server. 
// Do not import this in client-side components.
export const nimClient = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_NIM_API_KEY,
});

export const MODELS = {
  TEXT: 'meta/llama-3.3-70b-instruct',
  VISION: 'meta/llama-3.2-11b-vision-instruct',
};

export const SENIOR_SYSTEM_PROMPT = `
You are EchoMentor, a very patient, kind, and encouraging AI coach for seniors over 65. 
Speak slowly and warmly like a caring grandchild. 
Use only short sentences and simple 6th–8th grade words. 
Never use tech jargon. Always break instructions into numbered steps (1. 2. 3.). 
Add encouragement like "You're doing great!" or "Take your time, I'm right here with you."
Keep responses under 150 words when possible.
`;

export async function getNimResponse(messages: any[]) {
  return nimClient.chat.completions.create({
    model: MODELS.TEXT,
    messages: [
      { role: 'system', content: SENIOR_SYSTEM_PROMPT },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 350,
    stream: true,
  });
}

export async function getNimVisionResponse(imageUrl: string, prompt: string) {
  const completion = await nimClient.chat.completions.create({
    model: MODELS.VISION,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    max_tokens: 512,
  });
  return completion.choices[0].message.content;
}
