import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/agents/openai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File | null;

    if (!audio) {
      return NextResponse.json({ success: false, error: "Missing audio" }, { status: 400 });
    }

    const inputFile =
      audio.name && audio.name.includes(".")
        ? audio
        : new File([audio], "recording.webm", { type: audio.type || "audio/webm" });

    const transcription = await openai.audio.transcriptions.create({
      file: inputFile,
      model: "whisper-1"
    });

    return NextResponse.json({ success: true, text: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to transcribe" },
      { status: 500 }
    );
  }
}
