import { PaginatedResponse } from "../../shared";
import { Client } from "../entities";
import { Pagination } from "../shared/pagination";

export type FindByName = Pagination & {
  name: string;
};

export type FindByNameResponse = {
  clients: Client[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};
export default interface IClientsRepository {
  findById(id: string): Promise<Client | null>;
  findByName(data: FindByName): Promise<PaginatedResponse<Client> | null>;
  findAll(): Promise<Client[] | null>;
  findAnniversaryClients(): Promise<Client[] | null>;
  create(data: Omit<Client, 'id' | 'created_at'>): Promise<Client>;
  update(id: string, data: Omit<Client, 'id' | 'created_at'>): Promise<Client>;
  delete(id: string): Promise<Client>;
}   