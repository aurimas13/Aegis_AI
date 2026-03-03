import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { sourceCode, sourceLang } = await req.json();

  if (!sourceCode?.trim()) {
    return NextResponse.json(
      { error: "Source code is required" },
      { status: 400 }
    );
  }

  const startTime = Date.now();

  try {
    const result = await generateText({
      model: openai("gpt-4o"),
      system: `You are an enterprise AI expert specializing in legacy code modernization.

Your task:
1. Take the provided legacy code and translate it into modern, idiomatic Python.
2. Add comprehensive docstrings (module-level, class-level, and method-level) following Google-style docstring conventions.
3. Include 2 basic unit tests at the bottom of the file using pytest.

Rules:
- Output ONLY the Python code. No markdown fences, no explanations outside the code.
- Preserve the original logic and behavior exactly.
- Use modern Python 3.10+ features (type hints, dataclasses, etc.) where appropriate.
- Use meaningful variable and function names.
- Add proper error handling with specific exception types.
- Structure the code with classes/functions as appropriate.
- The unit tests should be practical and test core functionality.`,
      prompt: `Translate the following ${sourceLang} code into modern Python with docstrings and 2 unit tests:\n\n${sourceCode}`,
    });

    let code = result.text.trim();
    // Strip markdown code fences if present
    if (code.startsWith("```")) {
      code = code.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
    }

    const durationMs = Date.now() - startTime;
    const tokensEst = Math.round(code.length / 4);

    // Log to Supabase (fire-and-forget, don't block the response)
    const sb = getSupabase();
    if (sb) {
      sb.from("modernization_logs")
        .insert({
          source_lang: sourceLang,
          target_lang: "Python",
          source_code: sourceCode,
          output_code: code,
          model: "gpt-4o",
          tokens_est: tokensEst,
          duration_ms: durationMs,
        })
        .then(({ error }) => {
          if (error) console.error("Supabase modernization_logs insert error:", error.message);
        });
    }

    return NextResponse.json({ code });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
