import IMonthsRepository from "@/interfaces/repositories/months-repository";
import { badRequest, ok } from "../helpers/response-helper";
import { Request, Response } from "express";
import IInvoicesRepository from "@/interfaces/repositories/invoices-repository";

export class MonthsController {
  constructor(
    private readonly monthsRepository: IMonthsRepository ,
    private readonly invoicesRepository: IInvoicesRepository 
  ) {}

  async getAll(req: Request, res: Response) {
    try {

      const months = await this.monthsRepository.findAll();
      return ok(res, months, 'Months found');
    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  }

  async getInvoices(req: Request, res: Response) {
    try {
      const monthId = req.params.id;
      const { page, page_size } = req.query;

      const invoices = await this.invoicesRepository.findMonthInvoices({
        month_id: monthId,
        page: Number(page),
        page_size: Number(page_size),
      });
      return ok(res, invoices, 'Invoices found for month');
    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  }
}
