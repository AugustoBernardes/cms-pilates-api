import { Request, Response } from "express";
import { badRequest, ok } from "../helpers/response-helper";
import { updateInvoiceSchema } from "../validators";
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
}
