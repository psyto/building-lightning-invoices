import { Invoice } from "./Invoice";

export class Link {
    public invoice: Invoice;

    constructor(
        public priorPreimage: string,
        public localSignature: string,
        public minSats: number,
    ) {}

    public get isSettled(): boolean {
        throw new Error("Exercise");
    }

    public get next(): string {
        throw new Error("Exercise");
    }

    public settle(invoice: Invoice) {
        this.invoice = invoice;
    }

    public toJSON() {
        if (this.isSettled) {
            return {
                priorPreimage: this.priorPreimage,
                localSignature: this.localSignature,
                minSats: this.minSats,
                invoice: this.invoice.toJSON(),
                isSettled: this.isSettled,
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
