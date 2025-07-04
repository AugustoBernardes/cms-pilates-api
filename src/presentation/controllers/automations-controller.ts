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
      const month = await this.findOrCreateMonth(monthDate);

      const invoicesToCreate: Omit<Invoice, 'created_at'>[] = [];

      let currentPage = 1;
      let totalPages = 1;

      do {
        const pageResult = await this.clientsRepository.findAll({
          page: currentPage,
          page_size: 100,
        });

        if (!pageResult?.data || pageResult.data.length === 0) {
          if (currentPage === 1) {
            return ok(res, [], 'No clients found');
          }
          break;
        }

        invoicesToCreate.push(...buildOpenInvoices(pageResult.data, month.id));
        totalPages = pageResult.total_pages ?? 1;
        currentPage++;
      } while (currentPage <= totalPages);

      await this.invoicesRepository.createMany(invoicesToCreate);

      return ok(res, invoicesToCreate, 'Invoices created successfully');
    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  }

  private async findOrCreateMonth(monthDate: string) {
    return (
      (await this.monthRepository.findByValue(monthDate)) ??
      this.monthRepository.create({
        id: uuidv4(),
        month: monthDate,
      })
    );
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
