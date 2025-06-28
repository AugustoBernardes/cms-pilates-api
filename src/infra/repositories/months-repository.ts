import { Month } from "@/interfaces/entities";
import { PrismaClient } from "@prisma/client";
import IMonthsRepository from "@/interfaces/repositories/months-repository";

const prisma = new PrismaClient()

export class MonthsRepository implements IMonthsRepository {
  async findAll(): Promise<Month[] | null> {
    return prisma.months.findMany({
      orderBy: {
        month: 'desc',
      },
      take: 12,
    });
  }

  async findByValue(month: string): Promise<Month | null> {
    return prisma.months.findFirst({
      where: {
        month: month,
      },
    });
  }

  async create(month: Month): Promise<Month> {
    return prisma.months.create({
      data: {
        id: month.id,
        month: month.month,
      },
    });
  }
}