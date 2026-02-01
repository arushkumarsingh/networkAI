import { Button } from "@/components/ui/button";

type Props = {
  imageSrc: string;
  captureType: "selfie" | "card";
  onReset: () => void;
};

export default function ImagePreview({ imageSrc, captureType, onReset }: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          {captureType === "selfie" ? "Selfie capture" : "Business card capture"}
        </p>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white/70">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="Capture preview" className="h-64 w-full object-cover" />
      </div>
    </div>
  );
}
