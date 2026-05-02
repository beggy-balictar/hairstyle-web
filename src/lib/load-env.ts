import { config } from "dotenv";
import { resolve } from "path";

/**
 * Next.js already loads `.env*` for the app, but API routes that import Prisma
 * need DATABASE_URL before the client is constructed. Also, `.env.example` is
 * never loaded by default — in development we fall back to it so a filled
 * example file still works locally (use real secrets in `.env.local` for production).
 */
const root = process.cwd();

config({ path: resolve(root, ".env.local") });
config({ path: resolve(root, ".env") });

if (process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL?.trim()) {
  config({ path: resolve(root, ".env.example") });
}

/** Google AI Studio / GenAI SDK env names vary; normalize to GEMINI_API_KEY for our routes. */
function normalizeGeminiApiKey() {
  const existing = process.env.GEMINI_API_KEY?.trim();
  if (existing) return;
  const fallback =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    process.env.GENAI_API_KEY?.trim();
  if (fallback) {
    process.env.GEMINI_API_KEY = fallback;
  }
}

normalizeGeminiApiKey();
