import { Request, Response } from "express";
import { badRequest, ok } from "../helpers/response-helper";
import { searchSchema, updateInvoiceSchema } from "../validators";
import IInvoicesRepository from "@/interfaces/repositories/invoices-repository";

export class InvoicesController {
  constructor(
    private readonly invoicesRepository: IInvoicesRepository
  ) {}

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parsed = updateInvoiceSchema.safeParse(req.body);

      if(!id || !parsed.success) {
        return badRequest(res, 'Invalid request data');
      }

      const invoice = await this.invoicesRepository.update(id, parsed.data);
      return ok(res, invoice, 'Invoice updated successfully');

    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  }

  async findPendingInvoices(req: Request, res: Response) {
    try {
      const parsed = searchSchema.safeParse(req.query);
      const { page, page_size } = req.query;
      
      if (parsed.success) {
        const invoices = await this.invoicesRepository.findPendingInvoices({
          search: parsed.data.search,
          page: Number(page),
          page_size: Number(page_size),
        });

        return ok(res, invoices, 'Pending invoices retrieved successfully');
      }

      const invoices = await this.invoicesRepository.findPendingInvoices({
        page: Number(page),
        page_size: Number(page_size),
      });

      return ok(res, invoices, 'Invoices retrieved successfully');
    } catch (error: any) {
      return badRequest(res, error.message, error);
    }  
  } 
}
