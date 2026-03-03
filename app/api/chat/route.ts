import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Log the latest user message to Supabase
  const lastUserMsg = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === "user");
  if (lastUserMsg) {
    const userText = lastUserMsg.parts
      ?.filter((p: { type: string }) => p.type === "text")
      .map((p: { text: string }) => p.text)
      .join("") ?? "";
    const sb = getSupabase();
    if (userText && sb) {
      sb.from("chat_logs")
        .insert({ role: "user", content: userText, model: "gpt-4o-mini", tokens_est: Math.round(userText.length / 4) })
        .then(({ error }: { error: { message: string } | null }) => {
          if (error) console.error("Supabase chat_logs insert error (user):", error.message);
        });
    }
  }

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
    onFinish({ text }) {
      // Log the assistant response to Supabase
      const sbFinish = getSupabase();
      if (text && sbFinish) {
        sbFinish
          .from("chat_logs")
          .insert({ role: "assistant", content: text, model: "gpt-4o-mini", tokens_est: Math.round(text.length / 4) })
          .then(({ error }: { error: { message: string } | null }) => {
            if (error) console.error("Supabase chat_logs insert error (assistant):", error.message);
          });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
