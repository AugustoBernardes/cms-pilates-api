import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.months.createMany({
    data: [
      { month: '2025-01', id: '1' },
      { month: '2025-02', id: '2' },
      { month: '2025-03', id: '3' },
    ],
  });

  await prisma.clients.createMany({
    data: [
      { id: '1', name:'Augusto', phone: '649910', cpf:'022', birth_date: new Date(2004, 2, 30), current_invoice_price: 100.2 },
      { id: '2', name:'Otavio', phone: '1233', cpf:'123', birth_date: new Date(2007, 3, 3), current_invoice_price: 30 },
    ],
  });

  await prisma.invoices.createMany({
    data: [
      { id: '1',status: 'paid', month_id: '1', client_id: '1', value: 80 },
      { id: '2',status: 'paid', month_id: '2', client_id: '1', value: 90 },
      { id: '3',status: 'paid', month_id: '3', client_id: '1', value: 100.2 },
      { id: '4', status: 'paid', month_id: '3', client_id: '2', value: 30 },
    ],
  });
}

seed()