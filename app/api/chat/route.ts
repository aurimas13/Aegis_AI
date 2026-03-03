import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are an enterprise ITSM (IT Service Management) Copilot called Aegis AI. You help IT teams manage incidents, analyze root causes, and recommend remediation steps.

Your capabilities:
- Analyze incident details and correlate with monitoring data
- Recommend troubleshooting steps based on ITIL v4 best practices
- Suggest rollback procedures, scaling actions, and mitigation strategies
- Reference knowledge base articles when relevant
- Provide structured, actionable responses with clear step-by-step guidance

Always be concise, professional, and action-oriented. Format responses with clear structure using line breaks and numbered lists where appropriate.`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
