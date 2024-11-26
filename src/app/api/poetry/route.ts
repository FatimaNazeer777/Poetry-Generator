import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined in the environment variables");
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { mood } = await request.json();

    if (!mood) {
      return NextResponse.json(
        { error: "Mood is required in the request body." },
        { status: 400 }
      );
    }

    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      {
        role: "system",
        content:
          "You are an expert Urdu poet skilled in writing long, elaborate, and emotionally resonant poems. " +
          "You should always respond with poetry inspired by classical and modern Urdu styles, " +
          "and include at least 8 lines of poetry. Frame the poetry in Urdu " +
          "and explain the context of the mood before starting the poem.",
      },
      {
        role: "user",
        content: `My mood is ${mood}. Please compose exactly 4 sher (couplets) and no more, keeping it concise.`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
    });

    // Extract the content of the response
    const content =
      response.choices[0]?.message?.content || "No response generated.";

    return NextResponse.json({ poem: content });
  } catch (error: unknown) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unknown error occurred while generating poetry.",
      },
      { status: 500 }
    );
  }
}