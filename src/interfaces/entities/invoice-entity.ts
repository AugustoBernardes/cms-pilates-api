import { Client } from "./client-entity";

export interface Invoice {
    id: string;
    status: string | 'open' | 'paid';
    value: number;
    client_id: string;
    month_id: string;
    client?: Client
}