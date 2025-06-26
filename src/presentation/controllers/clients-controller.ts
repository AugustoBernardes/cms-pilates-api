import IClientsRepository from "@/interfaces/repositories/clients-repository";
import { Request, Response } from "express";
import { ok } from "../helpers/response-helper";

export class ClientsController {
 constructor(
    private readonly clientsRepository: IClientsRepository
 ) {}
  async handler(req: Request, res: Response) {
    const { search } = req.query;

    if (search) {
      const clients = await this.clientsRepository.findByName(search as string);
      return ok(res, clients, 'Clients found');
    }

    const clients = await this.clientsRepository.findAll();

    return ok(res, clients, 'Clients found');
  }
}