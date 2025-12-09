import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connectPrisma() {

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected due to application termination.");
    process.exit(0);
  });
}

connectPrisma();

export default prisma;
