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
