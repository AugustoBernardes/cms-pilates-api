import { Client, Invoice } from "@/interfaces/entities";
import IInvoicesRepository from "@/interfaces/repositories/invoices-repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export class InvoicesRepository implements IInvoicesRepository {
  async findClientsInvoices(client_id: string): Promise<Invoice[] | null> {
    return await prisma.invoices.findMany({
      where: { client_id },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}