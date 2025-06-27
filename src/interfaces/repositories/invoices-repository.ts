import { PaginatedResponse } from "../../shared";
import { Invoice } from "../entities";
import { Pagination } from "../shared/pagination";


export type FindClienstInvoicesParams = Pagination & {
  client_id: string;
};

export default interface IInvoicesRepository {
  findClientsInvoices(data: FindClienstInvoicesParams): Promise<PaginatedResponse<Invoice> | null>;
  update(id: string, data: Pick<Invoice, 'status' | 'value'>): Promise<Invoice>;
}