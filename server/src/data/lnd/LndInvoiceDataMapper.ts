import { Invoice } from "../../domain/Invoice";
import { CreateInvoiceResult } from "../../domain/CreateInvoiceResult";
import { ILndClient } from "./ILndClient";
import { Lnd } from "./v0.12.1-beta/Types";
import { IInvoiceDataMapper, InvoiceHandler } from "../../domain/IInvoiceDataMapper";

export class LndInvoiceDataMapper implements IInvoiceDataMapper {
    protected handlers: Set<InvoiceHandler>;

    constructor(readonly client: ILndClient) {
        this.handlers = new Set();
    }

    /**
     * Adds an invoice handler. The reason we are not using the EventEmitter
     * class is that our handlers are asynchronous and EventEmitter only
     * works with synchronous code.
     * @param handler
     */
    public addHandler(handler: InvoiceHandler) {
        this.handlers.add(handler);
    }

    /**
     * Adds an invoice and returns a CreateInvoiceResult
     * @returns
     */
    public async add(value: number, memo: string, preimage: Buffer): Promise<CreateInvoiceResult> {
        try {
            const invoice = await this.client.addInvoice({
                amt: value,
                memo,
                preimage,
            });
            return {
                success: true,
                paymentRequest: invoice.payment_request,
            };
        } catch (ex) {
            return {
                success: false,
                error: ex.message,
            };
        }
    }

    /**
     * This method looks up invoices from the LND invoice database filtering
     * to only those that match our application
     * @returns
     */
    public async sync(): Promise<void> {
        // subscribe to all new invoices/settlements
        void this.client.subscribeInvoices(invoice => {
            void this.processInvoice(invoice);
        }, {});

        // fetch all invoices
        const num_max_invoices = "1000";
        let index_offset: string = undefined;
        let cont = true;
        while (cont) {
            const results = await this.client.listInvoices({ index_offset, num_max_invoices });

            for (const invoice of results.invoices) {
                await this.processInvoice(invoice);
            }
            index_offset = (Number(results.last_index_offset) + 1).toString();

            cont = results.first_index_offset === results.last_index_offset;
        }
    }

    protected async processInvoice(invoice: Lnd.Invoice): Promise<void> {
        // convert lnd invoice into AppInvoice
        const appInvoice = this.convertInvoice(invoice);

        // emit to all async event handlers
        for (const handler of this.handlers) {
            await handler(appInvoice);
        }
    }

    protected convertInvoice(invoice: Lnd.Invoice): Invoice {
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
