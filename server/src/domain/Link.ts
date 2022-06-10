import { Invoice } from "./Invoice";

export class Link {
    public invoice: Invoice;

    constructor(
        public priorPreimage: string,
        public localSignature: string,
        public minSats: number,
    ) {}

    public get isSettled(): boolean {
        return !!this.invoice?.settled;
    }

    public get next(): string {
        return this.invoice?.preimage;
    }

    public settle(invoice: Invoice) {
        this.invoice = invoice;
    }

    public toJSON() {
        if (this.isSettled) {
            return {
                priorPreimage: this.priorPreimage,
                isSettled: this.isSettled,
                minSats: this.minSats,
                localSignature: this.localSignature,
                invoice: this.invoice,
                nodeId: this.invoice.buyerNodeId,
                next: this.next,
            };
        } else {
            return {
                priorPreimage: this.priorPreimage,
                isSettled: this.isSettled,
                minSats: this.minSats,
            };
        }
    }
}
