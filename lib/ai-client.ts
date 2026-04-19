import OpenAI from 'openai';

interface UserProfile {
  name: string;
  age: string;
  healthIssues: string;
  apiKey: string;
}

export const MODELS = {
  TEXT: 'meta/llama-3.3-70b-instruct',
  VISION: 'meta/llama-3.2-11b-vision-instruct',
};

/**
 * Builds the personalized system prompt based on user scenario
 */
export function buildSystemPrompt(profile: UserProfile) {
  const { name, age, healthIssues } = profile;
  
  let personalizedContext = "";
  if (name) personalizedContext += `The person you are talking to is named ${name}. Address them by name occasionally. `;
  if (age) personalizedContext += `They are ${age} years old. `;
  if (healthIssues) personalizedContext += `IMPORTANT: The user has these health considerations: ${healthIssues}. Adapt your instructions to be safe, patient, and easy for someone with these specific needs. `;

  return `
You are EchoMentor, a professional but extremely patient and light-hearted tech guide specialized in helping seniors.
${personalizedContext}

CORE TONE RULES:
- Speak like a caring expert who has all the time in the world.
- Use simple words (6th grade level).
- No tech jargon. Instead of "UI", say "the buttons you see". Instead of "Authentication", say "the lock and key".
- ONLY use numbered steps (1. 2. 3.) if the user asks "How to" or for a tutorial.
- If the user asks for a summary or general info, use conversational paragraphs or simple bullet points (•).
- Do NOT repeat phrases like "You're doing great" in every message. Be natural.

ADAPTIVE FORMATTING:
- If asked for a "summary," provide a warm 2-3 sentence overview.
- If asked "how to," provide clear, numbered steps.

ACTION DETECTION (EXTREMELY IMPORTANT):
If the user intent is to perform a device action, you MUST include a specific tag at the VERY END of your message:
- To call someone: [CALL: name or number]
- To open an app: [OPEN: app name]
- For a tutorial video: [YOUTUBE: search terms]

Example: "I'll open WhatsApp for you now. [OPEN: WhatsApp]"
Example: "I'm calling your son for you. [CALL: Son]"
`;
}

/**
 * Proxied Client-Side call to local Next.js server (to bypass CORS)
 */
export async function getPersonalNimResponse(
  messages: any[], 
  profile: UserProfile
) {
  if (!profile.apiKey) throw new Error("Missing API Key");

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: buildSystemPrompt(profile) },
        ...messages
      ],
      apiKey: profile.apiKey // Pass personal key to local proxy
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to connect to AI");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader");
  const decoder = new TextDecoder();

  return (async function* () {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const content = decoder.decode(value);
      // Support the same chunk structure
      yield { choices: [{ delta: { content } }] };
    }
  })();
}

/**
 * Proxied Client-Side Vision call to local Next.js server (to bypass CORS)
 */
export async function getPersonalNimVisionResponse(
  imageUrl: string, 
  prompt: string,
  profile: UserProfile
) {
  if (!profile.apiKey) throw new Error("Missing API Key");

  const response = await fetch('/api/vision', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: imageUrl,
      prompt: prompt, // Will be combined with system prompt server-side or passed as is
      apiKey: profile.apiKey,
      systemPrompt: buildSystemPrompt(profile)
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to analyze photo");
  }

  const data = await response.json();
  return data.analysis;
}
