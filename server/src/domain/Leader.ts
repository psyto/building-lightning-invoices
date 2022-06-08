import { Invoice } from "./Invoice";

export class Leader {
    public next: string;
    public invoice: Invoice;

    constructor(public identifier: string, public localSignature: string) {}

    public get isSettled(): boolean {
        return this.invoice !== undefined;
    }

    public get nodeId(): string {
        return this.invoice?.memo.split("_")[1];
    }

    public toJSON() {
        if (this.isSettled) {
            return {
                identifier: this.identifier,
                localSignature: this.localSignature,
                invoice: this.invoice,
                nodeId: this.nodeId,
                next: this.next,
                isSettled: this.isSettled,
            };
        } else {
            return {
                identifier: this.identifier,
                isSettled: this.isSettled,
            };
        }
    }
}
