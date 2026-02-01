import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/agents/openai";

type ExtractRequest = {
  voiceContext?: string;
  imageAnalysis?: unknown;
  type?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { voiceContext, imageAnalysis, type } = (await request.json()) as ExtractRequest;

    const prompt = `
You are analyzing a networking contact capture. 

Voice Context: "${voiceContext ?? ""}"
Image Analysis: ${JSON.stringify(imageAnalysis)}
Type: ${type}

Extract and return JSON with:
{
  "name": "extracted or inferred name",
  "relationship": "how they relate to the user (client, investor, developer, etc.)",
  "tags": ["relevant", "tags"],
  "priority": "high|medium|low",
  "followUpDate": "YYYY-MM-DD or null",
  "followUpType": "meeting|call|email|check-in or null",
  "notes": "concise summary of context and why this person matters",
  "suggestedAction": "what the user should do next"
}

Base priority on urgency mentioned. Extract follow-up timing from phrases like "next week", "in 3 months", "Sunday".
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const extractedContext = JSON.parse(response.choices[0]?.message?.content || "{}");

    return NextResponse.json({ success: true, context: extractedContext });
  } catch (error) {
    console.error("Context extraction error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to extract context" },
      { status: 500 }
    );
  }
}
