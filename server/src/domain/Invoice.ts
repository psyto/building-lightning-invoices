import { sha256 } from "../util/Sha256";
import { Link } from "./Link";

/**
 * Domain specific class for handling invoices that the application is interested in.
 */
export class Invoice {
    /**
     * Creates a memo in the form `buy_{priorPreimage}_{buyer}` where preimage and buyer are both
     * hex encoded.
     * @param priorPreimage 32-byte preimage, hex encoded
     * @param buyer 33-byte public key of the buyer, hex encoded
     * @returns
     */
    public static createMemo(priorPreimage: string, buyer: string) {
        throw new Error("Exercise");
    }

    /**
     *
     * @param local
     * @param remote
     * @param sats
     * @returns
     */
    public static createPreimage(local: string, remote: string, sats: number) {
        throw new Error("Exercise");
    }

    constructor(
        public memo: string,
        public preimage: string,
        public hash: string,
        public valueSat: string,
        public settled: boolean = false,
        public settleDate?: number,
    ) {}

    /**
     * Returns true when the invoice's memo matches the buy_{priorPreimage}_{buyer} pattern
     * @returns
     */
    public isAppInvoice(): boolean {
        throw new Error("Exercise");
    }

    /**
     * Extracts the prior preimage value from the memo
     */
    public get priorPreimage(): string {
        throw new Error("Exercise");
    }

    /**
     * Extracts the buyer nodeId from the memo
     */
    public get buyerNodeId(): string {
        throw new Error("Exercise");
    }

    public settles(link: Link) {
        return this.settled && this.isAppInvoice() && this.priorPreimage === link.priorPreimage;
    }

    public toJSON() {
        return {
            memo: this.memo,
            preimage: this.preimage,
            hash: this.hash,
            valueSat: this.valueSat,
            settled: this.settled,
            settleDate: this.settleDate,
            priorPreimage: this.priorPreimage,
            buyerNodeId: this.buyerNodeId,
        };
    }
}
