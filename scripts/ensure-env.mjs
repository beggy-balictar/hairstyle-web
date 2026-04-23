/**
 * Prisma CLI does not load `.env.example`. If DATABASE_URL is missing from
 * `.env` and `.env.local`, copy `.env.example` → `.env` once so `db push` / `seed` work.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

if (process.env.DATABASE_URL?.trim()) {
  process.exit(0);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function fileHasDatabaseUrl(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return /^DATABASE_URL\s*=\s*\S/m.test(content);
  } catch {
    return false;
  }
}

const envLocal = path.join(root, ".env.local");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

const hasUrl = fileHasDatabaseUrl(envLocal) || fileHasDatabaseUrl(envPath);

if (!hasUrl && fs.existsSync(examplePath) && fileHasDatabaseUrl(examplePath)) {
  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(examplePath, envPath);
    console.warn("[stylehair] Created .env from .env.example so Prisma CLI can read DATABASE_URL.");
  } else {
    console.warn("[stylehair] DATABASE_URL missing: set it in .env.local or .env (see .env.example).");
  }
}
