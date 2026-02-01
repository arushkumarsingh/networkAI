"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, RefreshCcw } from "lucide-react";
import { analyzeImage, detectFace } from "@/agents/vision";
import ImagePreview from "@/components/ImagePreview";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { addContact } from "@/lib/storage";
import type { Contact } from "@/lib/types";

const buildTwoLineContext = (primary?: string, fallback?: string) => {
  const raw = (primary ?? fallback ?? "").trim();
  if (!raw) return "";

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length >= 2) return `${lines[0]}\n${lines[1]}`;

  const sentences = raw
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  if (sentences.length >= 2) return `${sentences[0]}\n${sentences[1]}`;
  if (sentences.length === 1) {
    return `${sentences[0]}\nFollow up while the conversation is fresh.`;
  }

  return raw;
};

export default function CapturePage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [preferredDeviceId, setPreferredDeviceId] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [context, setContext] = useState("");
  const [parsedContext, setParsedContext] = useState<{
    name: string | null;
    organization: string | null;
    position: string | null;
    connectionSummary: string | null;
  } | null>(null);

  useEffect(() => {
    const pickBestCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        if (videoDevices.length === 0) return;

        const scored = videoDevices.map((device) => {
          const label = device.label.toLowerCase();
          let score = 0;
          if (label.includes("back") || label.includes("rear")) score += 5;
          if (label.includes("wide")) score += 2;
          if (label.includes("ultra") || label.includes("0.5")) score -= 5;
          if (label.includes("front") || label.includes("user")) score -= 3;
          return { deviceId: device.deviceId, score };
        });

        const best = scored.sort((a, b) => b.score - a.score)[0];
        if (best?.deviceId) setPreferredDeviceId(best.deviceId);
      } catch (error) {
        console.warn("Camera selection failed:", error);
      }
    };

    if (facingMode === "environment") {
      pickBestCamera();
    } else {
      setPreferredDeviceId(null);
    }
  }, [facingMode]);

  const capture = () => {
    const nextImage = webcamRef.current?.getScreenshot();
    if (nextImage) {
      setImageSrc(nextImage);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!imageSrc) return;
    setIsSaving(true);
    try {
      const detection = await detectFace(imageSrc);
      const createdAt = new Date().toISOString();

      if (detection.hasFace) {
        const selfieAnalysis = await analyzeImage({
          image: imageSrc,
          type: "selfie",
          voiceContext: context
        });

        const cardAnalysis = await analyzeImage({
          image: imageSrc,
          type: "business-card",
          voiceContext: context
        });

        const selfieContact: Contact = {
          id: crypto.randomUUID(),
          type: "selfie",
          name:
            parsedContext?.name ??
            selfieAnalysis.parsedName ??
            selfieAnalysis.name ??
            "New contact",
          title: parsedContext?.position ?? selfieAnalysis.professionalContext ?? "",
          company: parsedContext?.organization ?? selfieAnalysis.organization ?? "",
          email: "",
          phone: "",
          imageUrl: imageSrc,
          imageType: "selfie",
          context: buildTwoLineContext(
            (parsedContext?.connectionSummary as string | undefined) ??
              (selfieAnalysis.connectionSummary as string | undefined),
            selfieAnalysis.description ?? context
          ),
          tags: selfieAnalysis.suggestedTags ?? [],
          notes: selfieAnalysis.description ?? "",
          relationship: "",
          priority: "medium",
          reminderSent: false,
          createdAt
        };

        const cardContact: Contact = {
          id: crypto.randomUUID(),
          type: "business-card",
          name:
            parsedContext?.name ??
            cardAnalysis.parsedName ??
            cardAnalysis.name ??
            "Business card contact",
          title: parsedContext?.position ?? cardAnalysis.title ?? "",
          company:
            parsedContext?.organization ??
            cardAnalysis.organization ??
            cardAnalysis.company ??
            "",
          email: cardAnalysis.email ?? "",
          phone: cardAnalysis.phone ?? "",
          imageUrl: imageSrc,
          imageType: "card",
          context: buildTwoLineContext(
            (parsedContext?.connectionSummary as string | undefined) ??
              (cardAnalysis.connectionSummary as string | undefined),
            context
          ),
          tags: [],
          notes: cardAnalysis.rawText ?? "",
          relationship: "",
          priority: "medium",
          reminderSent: false,
          createdAt
        };

        addContact(selfieContact);
        addContact(cardContact);
      } else {
        const cardAnalysis = await analyzeImage({
          image: imageSrc,
          type: "business-card",
          voiceContext: context
        });

        const cardContact: Contact = {
          id: crypto.randomUUID(),
          type: "business-card",
          name:
            parsedContext?.name ??
            cardAnalysis.parsedName ??
            cardAnalysis.name ??
            "Business card contact",
          title: parsedContext?.position ?? cardAnalysis.title ?? "",
          company:
            parsedContext?.organization ??
            cardAnalysis.organization ??
            cardAnalysis.company ??
            "",
          email: cardAnalysis.email ?? "",
          phone: cardAnalysis.phone ?? "",
          imageUrl: imageSrc,
          imageType: "card",
          context: buildTwoLineContext(
            (parsedContext?.connectionSummary as string | undefined) ??
              (cardAnalysis.connectionSummary as string | undefined),
            context
          ),
          tags: [],
          notes: cardAnalysis.rawText ?? "",
          relationship: "",
          priority: "medium",
          reminderSent: false,
          createdAt
        };

        addContact(cardContact);
      }
    } finally {
      setIsSaving(false);
      setImageSrc(null);
    }
  };

  return (
    <div className="container mx-auto space-y-6 px-0">
      <h1 className="text-2xl font-bold md:text-3xl">Capture Contact</h1>

      {!imageSrc ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full max-w-lg rounded-lg"
            videoConstraints={{
              facingMode,
              deviceId: preferredDeviceId ? { exact: preferredDeviceId } : undefined,
              width: { ideal: 1600 },
              height: { ideal: 1200 },
            }}
          />
          <div className="mt-3 flex items-center justify-between gap-6 rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-full border border-black/10 bg-white"
              onClick={() =>
                setFacingMode((mode) => (mode === "user" ? "environment" : "user"))
              }
              aria-label="Switch camera"
            >
              <RefreshCcw className="h-5 w-5" />
            </Button>

            <button
              type="button"
              onClick={capture}
              className="relative h-16 w-16 rounded-full border-4 border-white bg-white shadow-lg"
              aria-label="Capture photo"
            >
              <span className="absolute inset-1 rounded-full border border-black/10" />
            </button>

            <label className="cursor-pointer">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-full border border-black/10 bg-white"
                asChild
              >
                <span aria-label="Upload photo">
                  <ImageIcon className="h-5 w-5" />
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <ImagePreview
            imageSrc={imageSrc}
            captureType="selfie"
            onReset={() => setImageSrc(null)}
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} size="lg" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Contact"}
            </Button>
            <Button variant="outline" size="lg" onClick={() => setImageSrc(null)}>
              Retake
            </Button>
          </div>
        </div>
      )}

      <VoiceRecorder
        onTranscription={(text, parsed) => {
          setContext(text);
          setParsedContext(parsed ?? null);
        }}
      />
    </div>
  );
}
