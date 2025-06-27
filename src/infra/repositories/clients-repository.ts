import { Client } from "@/interfaces/entities";
import IClientsRepository, { FindByName } from "@/interfaces/repositories/clients-repository";
import { PaginatedResponse, paginatedResponseUtil, paginationUtil } from "../../shared";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export class ClientsRepository implements IClientsRepository {
  async findAll() : Promise<Client[]> {
    return await prisma.clients.findMany();
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
          name: {
            contains: data.name,
            mode: 'insensitive',
          },
        },
      }),
      prisma.clients.findMany({
        where: {    
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
    return await prisma.clients.delete({
      where: { id },
    });
  }
}