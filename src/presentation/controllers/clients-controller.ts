import IClientsRepository from "@/interfaces/repositories/clients-repository";
import { Request, Response } from "express";
import { badRequest, ok } from "../helpers/response-helper";
import { searchSchema } from "../validators";

export class ClientsController {
  constructor(
    private readonly clientsRepository: IClientsRepository
  ) {}

  async getAll(req: Request, res: Response) {
    try {
      const parsed = searchSchema.safeParse(req.query);

      if (parsed.success && parsed.data.search) {
        const clients = await this.clientsRepository.findByName(parsed.data.search);
        return ok(res, clients, 'Clients found');
      }

      const clients = await this.clientsRepository.findAll();
      return ok(res, clients, 'Clients found');

    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  }
}
