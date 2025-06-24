import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.months.createMany({
    data: [
      { month: new Date(2025, 0, 1), id: '1' },
      { month: new Date(2025, 1, 1), id: '2' },
      { month: new Date(2025, 2, 1), id: '3' },
    ],
  });
}

seed()