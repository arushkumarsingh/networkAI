"use client";

import { useRef } from "react";

type Props = {
  onCapture: (value: string) => void;
};

export default function CameraCapture({ onCapture }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onCapture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Capture image</p>
          <p className="text-xs text-black/60">
            Use a webcam or upload a photo of the business card.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-black/20 px-3 py-1 text-xs font-semibold"
          onClick={() => inputRef.current?.click()}
        >
          Upload
        </button>
      </div>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
