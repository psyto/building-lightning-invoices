import { Leader } from "./Leader";
import { LndMessageSigner } from "./lnd/LndMessageSigner";

export class LeaderFactory {
    constructor(readonly signer: LndMessageSigner) {}

    public async createFromSeed(seed: string, startSats: number): Promise<Leader> {
        // sign the seed
        const firstSignature = await this.signer.sign(seed);

        // create the first link
        return new Leader(seed, firstSignature, startSats);
    }

    public async createFromSettled(settled: Leader): Promise<Leader> {
        if (!settled.isSettled) {
            throw new Error("Not settled");
        }

        // create our signature from the settled preimage
        const nextSignature = await this.signer.sign(settled.next);

        // calc the min acceptable invoice
        const minSats = Number(settled.invoice.valueSat) + 1;

        // create the leader record from the previous preimage, signature, and sats
        return new Leader(settled.next, nextSignature, minSats);
    }
}
