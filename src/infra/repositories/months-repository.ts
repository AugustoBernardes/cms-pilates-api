import { Month } from "@/interfaces/entities";
import { PrismaClient } from "@prisma/client";
import IMonthsRepository from "@/interfaces/repositories/months-repository";

const prisma = new PrismaClient()

export class MonthsRepository implements IMonthsRepository {
  findAll(): Promise<Month[] | null> {
    return prisma.months.findMany({
      orderBy: {
        month: 'desc',
      },
      take: 12,
    });
  }
}