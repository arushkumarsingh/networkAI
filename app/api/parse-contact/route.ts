import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/agents/openai";

export async function POST(request: NextRequest) {
  try {
    const { text } = (await request.json()) as { text?: string };

    if (!text || !text.trim()) {
      return NextResponse.json({ success: true, data: null });
    }

    const responseFormat = {
      type: "json_schema",
      json_schema: {
        name: "contact_context",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: {
              anyOf: [{ type: "string" }, { type: "null" }]
            },
            organization: {
              anyOf: [{ type: "string" }, { type: "null" }]
            },
            position: {
              anyOf: [{ type: "string" }, { type: "null" }]
            },
            connectionSummary: {
              anyOf: [{ type: "string" }, { type: "null" }]
            }
          },
          required: ["name", "organization", "position", "connectionSummary"]
        }
      }
    } as const;

    const response = await (openai.chat.completions as any).create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You extract structured networking details from a voice note. " +
            "Return JSON that strictly matches the provided schema."
        },
        {
          role: "user",
          content:
            "Voice note:\n" +
            text +
            "\n\nReturn name, organization, position, and a two-line connection summary. " +
            "Use null when unknown. Keep each line under 90 characters."
        }
      ],
      // OpenAI SDK types in this project don't yet include json_schema response_format.
      response_format: responseFormat,
      max_tokens: 200
    });

    const content = response.choices[0]?.message?.content ?? "";
    let data: {
      name: string | null;
      organization: string | null;
      position: string | null;
      connectionSummary: string | null;
    } | null = null;

    try {
      data = JSON.parse(content) as {
        name: string | null;
        organization: string | null;
        position: string | null;
        connectionSummary: string | null;
      };
    } catch {
      data = null;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Parse contact error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse contact" },
      { status: 500 }
    );
  }
}
