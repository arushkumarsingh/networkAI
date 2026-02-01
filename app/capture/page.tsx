"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/ImagePreview";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { addContact } from "@/lib/storage";
import type { Contact } from "@/lib/types";

export default function CapturePage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [captureType, setCaptureType] = useState<"selfie" | "card">("selfie");
  const webcamRef = useRef<Webcam>(null);
  const [context, setContext] = useState("");

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

  const handleSave = () => {
    if (!imageSrc) return;
    const contact: Contact = {
      id: crypto.randomUUID(),
      type: captureType === "card" ? "business-card" : "selfie",
      imageUrl: imageSrc,
      imageType: captureType === "card" ? "card" : "selfie",
      context,
      tags: [],
      notes: "",
      relationship: "",
      priority: "medium",
      reminderSent: false,
      createdAt: new Date().toISOString()
    };
    addContact(contact);
    setImageSrc(null);
  };

  return (
    <div className="container mx-auto space-y-6 px-0">
      <h1 className="text-2xl font-bold md:text-3xl">Capture Contact</h1>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setCaptureType("selfie")}
          variant={captureType === "selfie" ? "default" : "outline"}
        >
          📸 Selfie
        </Button>
        <Button
          onClick={() => setCaptureType("card")}
          variant={captureType === "card" ? "default" : "outline"}
        >
          💼 Business Card
        </Button>
      </div>

      {!imageSrc ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full max-w-lg rounded-lg"
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={capture} size="lg">
              Capture Photo
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="lg" asChild>
                <span>Upload Photo</span>
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
            captureType={captureType}
            onReset={() => setImageSrc(null)}
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} size="lg">
              Save Contact
            </Button>
            <Button variant="outline" size="lg" onClick={() => setImageSrc(null)}>
              Retake
            </Button>
          </div>
        </div>
      )}

      <VoiceRecorder onTranscription={(text) => setContext(text)} />
    </div>
  );
}
