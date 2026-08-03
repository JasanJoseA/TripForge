/**
 * Reusable AI request helper.
 *
 * IMPORTANT: the original spec hardcoded a bearer token for a third-party
 * proxy directly in source. That's not safe to ship — any key embedded in
 * frontend code is publicly visible to anyone who opens dev tools. Instead,
 * this client reads its endpoint + key from environment variables (set them
 * in a local .env file, which is gitignored) so you can point it at whatever
 * backend you trust, ideally via your own server-side proxy rather than
 * calling a third party directly from the browser.
 *
 * If no endpoint is configured, the client transparently falls back to a
 * local simulation (see lib/mockAgents.ts) so the app is fully demoable
 * out of the box with zero external calls.
 */

export interface ChatCompletionMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const AI_API_URL = import.meta.env.VITE_AI_API_URL as string | undefined;
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY as string | undefined;
const AI_MODEL = (import.meta.env.VITE_AI_MODEL as string | undefined) ?? "class-chat-model";

export const isLiveModeConfigured = Boolean(AI_API_URL);

export class AIRequestError extends Error {}

export async function requestCompletion(
  messages: ChatCompletionMessage[],
  opts?: { signal?: AbortSignal }
): Promise<string> {
  if (!AI_API_URL) {
    throw new AIRequestError("No AI endpoint configured — use the simulated agents instead.");
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (AI_API_KEY) headers["Authorization"] = `Bearer ${AI_API_KEY}`;

  const res = await fetch(AI_API_URL, {
    method: "POST",
    headers,
    signal: opts?.signal,
    body: JSON.stringify({ model: AI_MODEL, messages }),
  });

  if (!res.ok) {
    throw new AIRequestError(`AI request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? data?.content?.[0]?.text;
  if (!content) throw new AIRequestError("AI response had no readable content.");
  return content as string;
}
