import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/agents/openai";

type AnalyzeRequest = {
  image: string;
  type: "business-card" | "selfie";
  voiceContext?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { image, type, voiceContext } = (await request.json()) as AnalyzeRequest;

    const prompt =
      type === "business-card"
        ? "Extract all information from this business card. Return as JSON with fields: name, title, company, email, phone, website, address. If any field is not visible, use null."
        : `This is a selfie from a networking event. The person said: "${voiceContext ?? ""}". 
Describe the person briefly (for memory aids only - professional context).
Extract: potential name if mentioned, setting/context, professional appearance.
Return as JSON with fields: description, professionalContext, suggestedTags.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: image }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content ?? "";

    let extractedData: Record<string, unknown> = {};
    try {
      extractedData = JSON.parse(content || "{}");
    } catch {
      extractedData = { rawText: content };
    }

    const trimmedContext = voiceContext?.trim();
    if (trimmedContext) {
      const contextPrompt = `You are preparing a concise networking note.\n\nVoice note:\n"${trimmedContext}"\n\nBusiness card details (if any):\nname: ${extractedData.name ?? "unknown"}\ntitle: ${extractedData.title ?? "unknown"}\ncompany: ${extractedData.company ?? "unknown"}\n\nReturn JSON with fields:\n- parsedName: best guess of the person's name (prefer explicit mention in the note; otherwise card name; null if unknown)\n- organization: company/org mentioned in the note; otherwise card company; null if unknown\n- connectionSummary: EXACTLY two short lines (no bullets), why I should contact this person and how we are connected. Use the organization if available.\n\nKeep each line under 90 characters.`;

      const contextResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: contextPrompt }],
        max_tokens: 200
      });

      const contextContent = contextResponse.choices[0]?.message?.content ?? "";
      try {
        const parsed = JSON.parse(contextContent || "{}") as Record<string, unknown>;
        extractedData = { ...extractedData, ...parsed };
      } catch {
        // Leave extractedData as-is when context parsing fails.
      }
    }

    return NextResponse.json({ success: true, data: extractedData });
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
