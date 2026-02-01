"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

export function VoiceRecorder({ onTranscription }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      await transcribeAudio(audioBlob);
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData
      });

      const { text } = (await response.json()) as { text: string };
      onTranscription(text);
    } catch (error) {
      console.error("Transcription error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
      <p className="text-sm font-semibold">Voice context</p>
      <p className="text-xs text-black/60">
        Record a quick note and let Whisper transcribe it.
      </p>
      <div className="mt-3 flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
        >
          {isRecording ? "⏹ Stop Recording" : "🎤 Record Context"}
        </Button>
        {isProcessing ? <p className="text-sm text-black/60">Processing...</p> : null}
      </div>
    </div>
  );
}
