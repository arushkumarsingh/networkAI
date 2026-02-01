import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/agents/openai";

type DetectRequest = {
  image: string;
};

export async function POST(request: NextRequest) {
  try {
    const { image } = (await request.json()) as DetectRequest;

    const prompt =
      "Does this image contain a human face? Return JSON {\"hasFace\": true|false, \"confidence\": 0-1, \"reason\": \"short\"}.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      max_tokens: 200
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let parsed: { hasFace?: boolean; confidence?: number; reason?: string } = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { hasFace: false, reason: "Unparseable response" };
    }

    return NextResponse.json({
      hasFace: Boolean(parsed.hasFace),
      confidence: parsed.confidence,
      reason: parsed.reason
    });
  } catch (error) {
    console.error("Face detection error:", error);
    return NextResponse.json(
      { hasFace: false, reason: "Detection failed" },
      { status: 500 }
    );
  }
}
