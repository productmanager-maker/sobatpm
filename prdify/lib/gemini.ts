import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SONNET = "claude-sonnet-4-6";
const HAIKU = "claude-haiku-4-5-20251001";

function is529(error: unknown): boolean {
  const msg = String((error as Error)?.message ?? error);
  return msg.includes("529") || msg.includes("overloaded");
}

function is429(error: unknown): boolean {
  const msg = String((error as Error)?.message ?? error);
  return msg.includes("429") || msg.includes("rate_limit");
}

export async function generate(
  system: string,
  user: string,
  maxTokens = 2000,
  model = SONNET
): Promise<string> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const msg = await client.messages.create({
        model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      });
      const block = msg.content[0];
      return block.type === "text" ? block.text : "";
    } catch (e) {
      lastError = e;
      if ((is429(e) || is529(e)) && attempt < 3) {
        const delay = attempt * 15000;
        console.log(`[Claude] rate limit — waiting ${delay}ms before retry ${attempt + 1}/3`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}

export function getHaikuModel() {
  return HAIKU;
}

export { client, SONNET, HAIKU };
