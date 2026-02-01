export const transcribeAudio = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Transcription failed");
  }

  const data = (await response.json()) as { text?: string };
  return data.text ?? "";
};
