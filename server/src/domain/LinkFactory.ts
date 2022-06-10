import { Link } from "./Link";
import { LndMessageSigner } from "../data/lnd/LndMessageSigner";

export class LinkFactory {
    constructor(readonly signer: LndMessageSigner) {}

    public async createFromSeed(seed: string, startSats: number): Promise<Link> {
        // sign the seed
        const firstSignature = await this.signer.sign(seed);

        // create the first link
        return new Link(seed, firstSignature, startSats);
    }

    public async createFromSettled(settled: Link): Promise<Link> {
        if (!settled.isSettled) {
            throw new Error("Not settled");
        }

        // create our signature from the settled preimage
        const nextSignature = await this.signer.sign(settled.next);

        // calc the min acceptable invoice
        const minSats = Number(settled.invoice.valueSat) + 1;

        // create the new link from the previous preimage, signature, and sats
        return new Link(settled.next, nextSignature, minSats);
    }
}
