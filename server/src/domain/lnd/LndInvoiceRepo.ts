import { EventEmitter } from "stream";
import { ILndRpcClient } from "./ILndRpcClient";
import { Lnd } from "./v0.12.1-beta/Types";

export interface LndInvoiceRepo {
    on(event: "invoice", cb: (invoice: Lnd.Invoice) => void);
}

export class LndInvoiceRepo extends EventEmitter {
    public cache: Map<string, Lnd.Invoice>;

    constructor(readonly client: ILndRpcClient) {
        super();
        this.cache = new Map();
    }

    /**
     * This method looks up invoices from the LND invoice database filtering
     * to only those that match our application
     * @returns
     */
    public async sync(): Promise<void> {
        // subscribe to all new invoices/settlements
        void this.client.subscribeInvoices(invoice => {
            this.cache.set(invoice.r_hash.toString("hex"), invoice);
            this.emit("invoice", invoice);
        }, {});

        // fetch
        const num_max_invoices = "1000";
        let index_offset: string = undefined;
        let cont = true;
        while (cont) {
            const results = await this.client.listInvoices({ index_offset, num_max_invoices });

            for (const invoice of results.invoices) {
                this.cache.set(invoice.r_hash.toString("hex"), invoice);
            }

            index_offset = (Number(results.last_index_offset) + 1).toString();

            cont = results.first_index_offset === results.last_index_offset;
        }
    }
}
