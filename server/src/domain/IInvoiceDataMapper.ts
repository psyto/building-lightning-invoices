import { Invoice } from "./Invoice";

export type InvoiceHandler = (invoice: Invoice) => void;

export interface IInvoiceDataMapper {
    add(value: number, memo: string, preimage: Buffer): Promise<string>;
    sync(): Promise<void>;
}
