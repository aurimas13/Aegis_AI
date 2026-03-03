import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sourceCode, sourceLang, targetLang } = await req.json();

  if (!sourceCode?.trim()) {
    return NextResponse.json(
      { error: "Source code is required" },
      { status: 400 }
    );
  }

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: `You are an expert legacy code modernization engine. You transform legacy code into modern, idiomatic code.

Rules:
- Output ONLY the transformed code, no explanations or markdown fences.
- Preserve the original logic and behavior exactly.
- Use modern language idioms, patterns, and best practices in the target language.
- Add proper type annotations where applicable.
- Use meaningful variable and function names.
- Add appropriate error handling.
- Structure the code using classes/modules as appropriate for the target language.`,
    prompt: `Transform the following ${sourceLang} code into ${targetLang}:\n\n${sourceCode}`,
  });

  let code = result.text.trim();
  if (code.startsWith("```")) {
    code = code.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
  }

  return NextResponse.json({ code });
}
