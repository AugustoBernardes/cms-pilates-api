import { Client, Invoice } from "@/interfaces/entities";
import IInvoicesRepository, { FindClienstInvoicesParams } from "@/interfaces/repositories/invoices-repository";
import { paginationUtil } from "../../shared";
import { PrismaClient } from "@prisma/client";
import { Pagination } from "@/interfaces/shared/pagination";

const prisma = new PrismaClient()

export class InvoicesRepository implements IInvoicesRepository {
  async findClientsInvoices({client_id, page, page_size}:FindClienstInvoicesParams): Promise<Invoice[] | null> {
    const { skip, take } = paginationUtil({page, page_size});
    return await prisma.invoices.findMany({
      where: { client_id },
      orderBy: {
        created_at: 'desc',
      },
      skip,
      take
    });
  }

  async update(id: string, data: Pick<Invoice, 'status' | 'value'>): Promise<Invoice> {
    return await prisma.invoices.update({
      where: { id },
      data,
    });
  }
}