import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient, UserRole } from "@prisma/client";

const root = process.cwd();
config({ path: resolve(root, ".env.local") });
config({ path: resolve(root, ".env") });
if (!process.env.DATABASE_URL?.trim()) {
  config({ path: resolve(root, ".env.example") });
}

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.hairstyle.count();
  if (count === 0) {
    await prisma.hairstyle.createMany({
      data: [
        {
          name: "Layered long waves",
          description: "Soft layers that add movement while keeping length.",
          category: "long",
          maintenanceLevel: "medium",
          suitableFaceShapes: ["oval", "oblong", "diamond"],
          genderTag: "any",
        },
        {
          name: "Textured bob",
          description: "Chin-length bob with light texture for softness.",
          category: "medium",
          maintenanceLevel: "low",
          suitableFaceShapes: ["round", "square", "oval"],
          genderTag: "any",
        },
        {
          name: "Side-swept pixie",
          description: "Short crop with volume on one side.",
          category: "short",
          maintenanceLevel: "low",
          suitableFaceShapes: ["triangle", "oval", "diamond"],
          genderTag: "any",
        },
        {
          name: "Blunt collarbone cut",
          description: "Strong perimeter line at the collarbone.",
          category: "medium",
          maintenanceLevel: "medium",
          suitableFaceShapes: ["rectangle", "oblong", "oval"],
          genderTag: "any",
        },
        {
          name: "Curly shag",
          description: "Layered shag that supports natural curl bounce.",
          category: "medium",
          maintenanceLevel: "medium",
          suitableFaceShapes: ["triangle", "oval", "diamond"],
          genderTag: "any",
        },
        {
          name: "Sleek straight lob",
          description: "Polished lob with minimal layers.",
          category: "medium",
          maintenanceLevel: "medium",
          suitableFaceShapes: ["round", "oval", "square"],
          genderTag: "any",
        },
      ],
    });
    console.log("[seed] Sample hairstyles inserted.");
  } else {
    console.log("[seed] Hairstyles already present; skipped.");
  }

  const adminHint = await prisma.user.count({ where: { role: UserRole.ADMIN } });
  if (adminHint === 0) {
    console.log("[seed] No admin user yet — open /first-admin-setup in the browser to create one with your own email and password.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
