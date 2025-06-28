import IMonthsRepository from "@/interfaces/repositories/months-repository";
import { badRequest, ok } from "../helpers/response-helper";
import { Request, Response } from "express";

export class MonthsController {
  constructor(
    private readonly monthsRepository: IMonthsRepository 
  ) {}

  async getAll(req: Request, res: Response) {
    try {

      const months = await this.monthsRepository.getAll();
      return ok(res, months, 'Months found');
    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  }

}
