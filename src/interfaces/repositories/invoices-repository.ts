import { Invoice } from "../entities";

export default interface IInvoicesRepository {
  findClientsInvoices(client_id: string): Promise<Invoice[] | null>;
}   