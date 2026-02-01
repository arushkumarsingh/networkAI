## Do you always forget the names of the people you meet at the networking events??
## Then Try NetworkAI

## Capture a selfie or business card, add voice context, and let AI summarize who you met.

Deployed:
```
https://network-ai-gamma.vercel.app/
```

## Features
- Camera capture with front/back toggle and mobile-style shutter UI
- Upload fallback for photos
- Voice context transcription (Whisper)
- AI image analysis (GPT‑4o): business card extraction + selfie context
- Face detection to decide selfie vs card flows
- Local contact storage with quick summaries
- Clerk authentication (App Router)

## Tech Stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS, shadcn/ui
- OpenAI API (GPT‑4o, Whisper)
- Clerk

## Project Structure
```
app/                Next.js routes + API
agents/             AI/LLM client helpers
components/         UI + feature components
lib/                types, utils, storage
public/             static assets
```

## Quick Start
1) Install dependencies
```
npm install
```
2) Set env vars
```
OPENAI_API_KEY=your_key
```
3) Run the app
```
npm run dev
```

## AI/LLM Integration
- `app/api/analyze-image`: GPT‑4o for card OCR + selfie context
- `app/api/detect-face`: GPT‑4o for selfie detection
- `app/api/extract-context`: GPT‑4o for context normalization
- `app/api/transcribe`: Whisper‑1 for voice transcription
- Shared client in `agents/openai.ts`

## Notes
- Contacts are stored in `localStorage` for the hackathon.
- If no image exists for a contact, a placeholder is used.
