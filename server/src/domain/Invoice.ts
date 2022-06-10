import { sha256 } from "../util/Sha256";
import { Leader } from "./Leader";

export class Invoice {
    public static createMemo(preimage: string, buyer: string) {
        return `buy_${preimage}_${buyer}`;
    }

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

    public get isAppInvoice(): boolean {
        return /^buy_[0-9a-f]{64}_[0-9a-f]{66}$/.test(this.memo);
    }

    public get forIdentifier(): string {
        return this.memo.split("_")[1];
    }

    public get forNodeId(): string {
        return this.memo.split("_")[2];
    }

    public settles(leader: Leader) {
        return this.settled && this.isAppInvoice && this.forIdentifier === leader.identifier;
    }
}
