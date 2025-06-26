import { Client } from "@/interfaces/entities";
import IClientsRepository from "@/interfaces/repositories/clients-repository";
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

  async findByName(name: string) : Promise<Client[] | null> {
    return await prisma.clients.findMany({
      where: { 
            name: {
              contains: name,
              mode: 'insensitive',
            } 
        },
    });
  }

  async create(data: Omit<Client, 'id' | 'created_at'>) {
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