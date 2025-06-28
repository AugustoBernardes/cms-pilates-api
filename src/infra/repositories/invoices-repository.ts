import { Invoice } from "@/interfaces/entities";
import IInvoicesRepository, { FindClienstInvoicesParams, FindMonthInvoicesParams } from "@/interfaces/repositories/invoices-repository";
import { PaginatedResponse, paginatedResponseUtil, paginationUtil } from "../../shared";
import { PrismaClient } from "@prisma/client";
import { Pagination } from "@/interfaces/shared/pagination";
import { v4 } from "uuid";

const prisma = new PrismaClient()

export class InvoicesRepository implements IInvoicesRepository {
  async findClientsInvoices(data:FindClienstInvoicesParams): Promise<PaginatedResponse<Invoice> | null> {
    const { skip, take, page, page_size } = paginationUtil({page: data.page, page_size: data.page_size});

    const [total,invoices] = await Promise.all([
      prisma.invoices.count({
        where: { client_id: data.client_id },
      }),
      prisma.invoices.findMany({
        where: { client_id: data.client_id },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take
      })
    ]) 

    return paginatedResponseUtil<Invoice>({data:invoices, total, page, page_size});
  }

  async update(id: string, data: Pick<Invoice, 'status'>): Promise<Invoice> {
    return await prisma.invoices.update({
      where: { id },
      data,
    });
  }

  async findPendingInvoices({search, ...data}: Pagination & {search?: string}): Promise<PaginatedResponse<Invoice> | null> {
    const { skip, take, page, page_size } = paginationUtil({page: data.page, page_size: data.page_size});

    const [total,invoices] = await Promise.all([
      prisma.invoices.count({
        where: {
          status: 'open',
          ...(search && { client: { name: { contains: search, mode: 'insensitive'} } }),
        },
      }),
      prisma.invoices.findMany({
        where: {
          status: 'open',
          ...(search && { client: { name: { contains: search,  mode: 'insensitive' } } }),
        },
        include: {
          client: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take
      })
    ])
    return paginatedResponseUtil<Invoice>({data:invoices, total, page, page_size});
  }

  async findMonthInvoices({month_id, ...data}: FindMonthInvoicesParams): Promise<PaginatedResponse<Invoice> | null> {
    const { skip, take, page, page_size } = paginationUtil({page: data.page, page_size: data.page_size});

    const [total, invoices] = await Promise.all([ 
      prisma.invoices.count({
          where: { month_id },
        }),
      prisma.invoices.findMany({
        where: { month_id },
            orderBy: {
            created_at: 'desc',
          },
        include: {
          client: true,
        },
        skip,
        take
      })
    ])

    return paginatedResponseUtil<Invoice>({data:invoices, total, page, page_size});
  }

  async createMany(data: Omit<Invoice[], 'client' | 'created_at'>): Promise<any> {
    return await prisma.invoices.createMany({
      data,
    })
  }
}