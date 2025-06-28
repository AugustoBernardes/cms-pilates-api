import IClientsRepository from "@/interfaces/repositories/clients-repository";
import { Request, Response } from "express";
import { badRequest, ok } from "../helpers/response-helper";
import { searchSchema } from "../validators";
import IInvoicesRepository from "@/interfaces/repositories/invoices-repository";
import { clientSchema } from "../validators/user-clients-schema";
import { v4 as uuidv4 } from 'uuid';

export class ClientsController {
  constructor(
    private readonly clientsRepository: IClientsRepository,
    private readonly invoicesRepository: IInvoicesRepository
  ) {}

  async getAll(req: Request, res: Response) {
    try {
      const parsed = searchSchema.safeParse(req.query);
      const { page, page_size } = req.query;

      if (parsed.success && parsed.data.search) {
        const clients = await this.clientsRepository.findByName({
          name: parsed.data.search,
          page: Number(page),
          page_size: Number(page_size),
        });
        return ok(res, clients, 'Clients found');
      }

      const clients = await this.clientsRepository.findAll({
        page: Number(page),
        page_size: Number(page_size)
      });
      return ok(res, clients, 'Clients found');

    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  }

  async getInvoices(req: Request, res: Response) {
    try {
      const client_id = req.params.id;
      const { page, page_size } = req.query;
      
      if (!client_id) {
        return badRequest(res, 'Client ID is required');
      }

      const invoices = await this.invoicesRepository.findClientsInvoices({
        client_id: client_id,
        page: Number(page),
        page_size: Number(page_size),
      });
      return ok(res, invoices, 'Invoices found for client');

    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = clientSchema.safeParse(req.body);

      if (!parsed.success) {
        return badRequest(res, undefined, parsed.error);
      }

      const clientData = {
        id: uuidv4(),
        ...parsed.data,
        birth_date: new Date(parsed.data.birth_date),
      };

      const client = await this.clientsRepository.create(clientData);
      return ok(res, client, 'Client created successfully');

    } catch (error: any) {
      console.error('Error creating client:', error);
      return badRequest(res, error.message, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const client_id = req.params.id;
      const parsed = clientSchema.safeParse(req.body);

      if (!parsed.success) {
        return badRequest(res, undefined, parsed.error);
      }

      const clientData = {
        ...parsed.data,
        birth_date: new Date(parsed.data.birth_date),
      };

      const client = await this.clientsRepository.update(client_id, clientData);
      return ok(res, client, 'Client updated successfully');

    } catch (error: any) {
      console.error('Error updating client:', error);
      return badRequest(res, error.message, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const client_id = req.params.id;
      if (!client_id) {
        return badRequest(res, 'Client ID is required');
      }

      const client = await this.clientsRepository.delete(client_id);
      return ok(res, client, 'Client deleted successfully');

    } catch (error: any) {
      console.error('Error deleting client:', error);
      return badRequest(res, error.message, error);
    }
  }
}
