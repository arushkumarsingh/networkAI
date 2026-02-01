type AnalyzeRequest = {
  image: string;
  type: "business-card" | "selfie";
  voiceContext?: string;
};

type DetectFaceResponse = {
  hasFace: boolean;
  confidence?: number;
  reason?: string;
};

export const detectFace = async (image: string): Promise<DetectFaceResponse> => {
  const response = await fetch("/api/detect-face", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image })
  });

  if (!response.ok) {
    return { hasFace: false, reason: "Detection failed" };
  }

  return (await response.json()) as DetectFaceResponse;
};

export const analyzeImage = async ({
  image,
  type,
  voiceContext
}: AnalyzeRequest): Promise<Record<string, any>> => {
  const response = await fetch("/api/analyze-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, type, voiceContext })
  });

  if (!response.ok) {
    return {};
  }

  const data = (await response.json()) as { data?: Record<string, any> };
  return data.data ?? {};
};
