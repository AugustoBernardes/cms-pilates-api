import { PaginatedResponse } from "../../shared";
import { Invoice } from "../entities";
import { Pagination } from "../shared/pagination";


export type FindClienstInvoicesParams = Pagination & {
  client_id: string;
};

export type FindMonthInvoicesParams = Pagination &{
  month_id: string;
};

export interface MonthResume {
  total: number;
  total_open: number;
  total_paid: number;
}

export default interface IInvoicesRepository {
  findClientsInvoices(data: FindClienstInvoicesParams): Promise<PaginatedResponse<Invoice> | null>;
  update(id: string, data: Pick<Invoice, 'status'>): Promise<Invoice>;
  findPendingInvoices(data: Pagination & {search?: string}): Promise<PaginatedResponse<Invoice> | null>;
  findMonthInvoices(data: FindMonthInvoicesParams): Promise<PaginatedResponse<Invoice> | null>;
  createMany(data: Omit<Invoice[], 'client' | 'created_at'>): Promise<any>;
  monthResume(month_id: string) : Promise<MonthResume>
  create(data: Omit<Invoice, 'created_at' | 'client' | 'month'>): Promise<Invoice>
}