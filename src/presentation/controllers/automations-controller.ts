import IClientsRepository from "@/interfaces/repositories/clients-repository";
import { Request, Response } from "express";
import { badRequest, ok } from "../helpers/response-helper";
import IInvoicesRepository from "@/interfaces/repositories/invoices-repository";
import { v4 as uuidv4 } from 'uuid';
import IMonthsRepository from "@/interfaces/repositories/months-repository";
import { Client, Invoice } from "@/interfaces/entities";
import { currentDateStringUtil } from "../../shared";

export class AutomationsController {
  constructor(
    private readonly clientsRepository: IClientsRepository,
    private readonly invoicesRepository: IInvoicesRepository,
    private readonly monthRepository: IMonthsRepository
  ) {}

  async createInvoice(req: Request, res: Response) {
    try {
      const monthDate = currentDateStringUtil();

      const existingMonth = await this.monthRepository.findByValue(monthDate);
      if (existingMonth) {
        return badRequest(res, 'Month already exists', { month: existingMonth });
      }

      const newMonth = await this.monthRepository.create({
        id: uuidv4(),
        month: monthDate,
      });

      const firstPage = await this.clientsRepository.findAll({ page: 1, page_size: 100 });
      if (!firstPage || firstPage.data.length === 0) {
        return ok(res, [], 'No clients found');
      }

      let invoicesToCreate: Omit<Invoice, 'created_at'>[] = [];
      invoicesToCreate.push(...buildOpenInvoices(firstPage.data, newMonth.id));

      const totalPages = firstPage.total_pages ?? 1;

      for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
        const nextPage = await this.clientsRepository.findAll({
          page: currentPage,
          page_size: 100,
        });

        if (!nextPage?.data || nextPage.data.length === 0) {
          break;
        }

        invoicesToCreate.push(...buildOpenInvoices(nextPage.data, newMonth.id));
      }

      await this.invoicesRepository.createMany(invoicesToCreate);

      return ok(res, invoicesToCreate, 'Invoices created successfully');
    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  } 
}

function buildOpenInvoices(clients: Client[], month_id: string): Omit<Invoice, 'created_at'>[] {
  return clients.map(client => ({
    id: uuidv4(),
    status: 'open',
    value: client.current_invoice_price,
    client_id: client.id,
    month_id,
  }));
}
