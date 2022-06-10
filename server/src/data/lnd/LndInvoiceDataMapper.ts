import { Invoice } from "../../domain/Invoice";
import { ILndClient } from "./ILndClient";
import { Lnd } from "./v0.12.1-beta/Types";
import { IInvoiceDataMapper, InvoiceHandler } from "../../domain/IInvoiceDataMapper";

export class LndInvoiceDataMapper implements IInvoiceDataMapper {
    protected handlers: Set<InvoiceHandler>;

    constructor(readonly client: ILndClient) {
        this.handlers = new Set();
    }

    /**
     * Adds an invoice handler that can be notified of invoice changes
     * @param handler
     */
    public addHandler(handler: InvoiceHandler) {
        this.handlers.add(handler);
    }

    /**
     * Notifies all handlers about an invoice
     * @param invoice
     */
    public async notifyHandlers(invoice: Invoice) {
        // emit to all async event handlers
        for (const handler of this.handlers) {
            await handler(invoice);
        }
    }

    /**
     * Adds an invoice and returns the payment_request
     * @returns
     */
    public async add(value: number, memo: string, preimage: Buffer): Promise<string> {
        const invoice = await this.client.addInvoice({
            amt: value,
            memo,
            preimage,
        });
        return invoice.payment_request;
    }

    /**
     * This method looks up invoices from the LND invoice database filtering
     * to only those that match our application
     * @returns
     */
    public async sync(): Promise<void> {
        // fetch all invoices
        const num_max_invoices = Number.MAX_SAFE_INTEGER.toString();
        const index_offset = "0";
        const results: Lnd.ListInvoiceResponse = await this.client.listInvoices({
            index_offset,
            num_max_invoices,
        });

        // process all retrieved invoices
        for (const invoice of results.invoices) {
            await this.notifyHandlers(this.convertInvoice(invoice));
        }

        // subscribe to all new invoices/settlements
        void this.client.subscribeInvoices(invoice => {
            void this.notifyHandlers(this.convertInvoice(invoice));
        }, {});
    }

    /**
     * Maps an LND Invoice into a domain Invoice
     * @param invoice
     * @returns
     */
    public convertInvoice(invoice: Lnd.Invoice): Invoice {
        return new Invoice(
            invoice.memo,
            invoice.r_preimage?.toString("hex"),
            invoice.r_hash.toString("hex"),
            invoice.value,
            invoice.settled,
            Number(invoice.settle_date),
        );
    }
}
