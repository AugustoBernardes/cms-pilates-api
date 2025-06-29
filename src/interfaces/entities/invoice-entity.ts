import { Client } from "./client-entity";
import { Month } from "./month-entity";

export interface Invoice {
    id: string;
    status: string | 'open' | 'paid';
    value: number;
    client_id: string;
    month_id: string;
    created_at?: Date;
    client?: Client
    month?: Month
}