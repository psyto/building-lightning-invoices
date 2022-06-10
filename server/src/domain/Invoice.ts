import { sha256 } from "../util/Sha256";
import { Leader } from "./Leader";

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
        return `buy_${priorPreimage}_${buyer}`;
    }

    /**
     *
     * @param local
     * @param remote
     * @param sats
     * @returns
     */
    public static createPreimage(local: string, remote: string, sats: number) {
        const input = Buffer.from(local + remote + sats.toString());
        return sha256(input);
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
        return /^buy_[0-9a-f]{64}_[0-9a-f]{66}$/.test(this.memo);
    }

    /**
     * Extracts the prior preimage value from the memo
     */
    public get priorPreimage(): string {
        return this.memo.split("_")[1];
    }

    /**
     * Extracts the buyer nodeId from the memo
     */
    public get buyerNodeId(): string {
        return this.memo.split("_")[2];
    }

    public settles(leader: Leader) {
        return this.settled && this.isAppInvoice() && this.priorPreimage === leader.identifier;
    }
}
