import { Client } from "@/interfaces/entities";
import IClientsRepository, { FindByName } from "@/interfaces/repositories/clients-repository";
import { PaginatedResponse, paginatedResponseUtil, paginationUtil } from "../../shared";
import { PrismaClient } from "@prisma/client";
import { Pagination } from "@/interfaces/shared/pagination";

const prisma = new PrismaClient()

export class ClientsRepository implements IClientsRepository {
  async findAll(data: Pagination) : Promise<PaginatedResponse<Client>> {
    const { skip, take, page, page_size } = paginationUtil({page: data.page, page_size: data.page_size});
    const [total, clients] = await Promise.all([
      prisma.clients.count({
        where: {
          deleted_at: null,
        },
      }),
      prisma.clients.findMany({
        where: {
          deleted_at: null,
        },
        skip,
        take,
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    return paginatedResponseUtil<Client>({data:clients, total, page, page_size});
  }

  async findById(id: string) : Promise<Client | null> {
    return await prisma.clients.findUnique({
      where: { id },
    });
  }

  async findByName(data: FindByName) : Promise<PaginatedResponse<Client> | null> {
    const { skip, take, page, page_size } = paginationUtil({page: data.page, page_size: data.page_size});
    
    const [total, clients] = await Promise.all([
      prisma.clients.count({
        where: {
          deleted_at: null,
          name: {
            contains: data.name,
            mode: 'insensitive',
          },
        },
      }),
      prisma.clients.findMany({
        where: {    
          deleted_at: null,
          name: {
            contains: data.name,
            mode: 'insensitive',
          } 
        },
        skip,
        take,
      })
    ]);

    return paginatedResponseUtil<Client>({data:clients, total, page, page_size});
  }

  async create(data: Omit<Client,'created_at'>) {
    return await prisma.clients.create({
      data,
    });
  }

  async update(id: string, data: Omit<Client, 'id' | 'created_at'>) {
    return await prisma.clients.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.clients.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async findAnniversaryClients(): Promise<Client[] | null> {
    const nextMonth = new Date().getMonth() + 2;

    const users = await prisma.$queryRawUnsafe(`
      SELECT * FROM "clients"
      WHERE EXTRACT(MONTH FROM "birth_date") = $1
      AND "deleted_at" IS NULL
      ORDER BY "birth_date" ASC
    `, nextMonth) as Client[];

    return users.length > 0 ? users : null;
  }

  async clientWithoutMonthInvoice(
    data: Pagination & { month_id: string }
  ): Promise<PaginatedResponse<Client> | null> {
    const { skip, take, page, page_size } = paginationUtil({
      page: data.page,
      page_size: data.page_size,
    });

    const [clients, countResult] = await Promise.all([
      prisma.$queryRaw<Client[]>`
        SELECT * FROM "clients" c
        WHERE NOT EXISTS (
          SELECT 1 FROM "invoices" i
          WHERE i."client_id" = c.id
            AND i."month_id" = ${data.month_id}
        )
        AND c."deleted_at" IS NULL
        ORDER BY c."name" ASC
        OFFSET ${skip}
        LIMIT ${take}
      `,
      prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*)::int AS count FROM "clients" c
        WHERE NOT EXISTS (
          SELECT 1 FROM "invoices" i
          WHERE i."client_id" = c.id
            AND i."month_id" = ${data.month_id}
        )
        AND c."deleted_at" IS NULL
      `,
    ]);

    const total = countResult?.[0]?.count ?? 0;

    return paginatedResponseUtil<Client>({
      data: clients,
      total,
      page,
      page_size,
    });
  }

}