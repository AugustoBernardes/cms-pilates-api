import { AutomationsController } from "@/presentation/controllers/automations-controller";
import { Request, Response } from "express";

import { Client } from "@/interfaces/entities";
import IClientsRepository from "@/interfaces/repositories/clients-repository";
import IInvoicesRepository from "@/interfaces/repositories/invoices-repository";
import IMonthsRepository from "@/interfaces/repositories/months-repository";

const mockClientsRepository = {
  findAll: jest.fn(),
} as unknown as IClientsRepository;

const mockInvoicesRepository = {
  createMany: jest.fn(),
} as unknown as IInvoicesRepository;

const mockMonthsRepository = {
  findByValue: jest.fn(),
  create: jest.fn(),
} as unknown as IMonthsRepository;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('AutomationsController - createInvoice', () => {
  let controller: AutomationsController;
  let req: Partial<Request>;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AutomationsController(
      mockClientsRepository,
      mockInvoicesRepository,
      mockMonthsRepository
    );
    req = {};
    res = mockResponse();
  });

  it('should return badRequest if month already exists', async () => {
    mockMonthsRepository.findByValue = jest.fn().mockResolvedValueOnce({ id: 'existing-month-id' });

    await controller.createInvoice(req as Request, res);

    expect(mockMonthsRepository.findByValue).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Month already exists',
    }));
  });

  it('should return ok with empty clients if no clients found', async () => {
    mockMonthsRepository.findByValue = jest.fn().mockResolvedValueOnce(null);
    mockMonthsRepository.create = jest.fn().mockResolvedValueOnce({ id: 'new-month-id', month: '2025-06' });
    mockClientsRepository.findAll = jest.fn().mockResolvedValueOnce({ data: [], total_pages: 1 });

    await controller.createInvoice(req as Request, res);

    expect(mockMonthsRepository.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'No clients found',
      data: [],
    }));
  });

  it('should create invoices and return ok', async () => {
    mockMonthsRepository.findByValue = jest.fn().mockResolvedValueOnce(null);
    mockMonthsRepository.create = jest.fn().mockResolvedValueOnce({ id: 'new-month-id', month: '2025-06' });

    const mockClientsPage1: Client[] = [
      { id: 'client-1', current_invoice_price: 100 } as Client,
    ];
    const mockClientsPage2: Client[] = [
      { id: 'client-2', current_invoice_price: 150 } as Client,
    ];

    mockClientsRepository.findAll = jest.fn()
      .mockResolvedValueOnce({ data: mockClientsPage1, total_pages: 2 }) // First page
      .mockResolvedValueOnce({ data: mockClientsPage2, total_pages: 2 }); // Second page

    mockInvoicesRepository.createMany = jest.fn().mockResolvedValueOnce(undefined);

    await controller.createInvoice(req as Request, res);

    expect(mockMonthsRepository.create).toHaveBeenCalled();
    expect(mockClientsRepository.findAll).toHaveBeenCalledTimes(2);
    expect(mockInvoicesRepository.createMany).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        client_id: 'client-1',
        status: 'open',
      }),
      expect.objectContaining({
        client_id: 'client-2',
        status: 'open',
      }),
    ]));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invoices created successfully',
    }));
  });

  it('should handle exceptions and return badRequest', async () => {
    mockMonthsRepository.findByValue = jest.fn().mockRejectedValue(new Error('Unexpected error'));

    await controller.createInvoice(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Unexpected error',
    }));
  });
});
