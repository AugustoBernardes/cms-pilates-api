export interface Client {
    id: string;
    name: string;
    phone: string;
    cpf?: string | null;
    current_invoice_price: number;
    birth_date: Date;
    created_at: Date;
}