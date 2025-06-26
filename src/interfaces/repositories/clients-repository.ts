import { Client } from "../entities";

export default interface IClientsRepository {
  findById(id: string): Promise<Client | null>;
  findByName(name: string): Promise<Client[] | null>;
  findAll(): Promise<Client[] | null>;
  create(data: Omit<Client, 'id' | 'created_at'>): Promise<Client>;
  update(id: string, data: Omit<Client, 'id' | 'created_at'>): Promise<Client>;
  delete(id: string): Promise<Client>;
}   