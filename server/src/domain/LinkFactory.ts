import { Link } from "./Link";
import { IMessageSigner } from "./IMessageSigner";

export class LinkFactory {
    constructor(readonly signer: IMessageSigner) {}

    /**
     * Creates the first Link from some arbitrary 32-byte (64 hex) seed.
     * @param seed
     * @param startSats
     * @returns
     */
    public async createFromSeed(seed: string, startSats: number): Promise<Link> {
        // sign the seed
        const firstSignature = await this.signer.sign(seed);

        // create the first link
        return new Link(seed, firstSignature, startSats);
    }

    /**
     * Creates a new link from a settled link. This method will construct
     * a new link by
     *
     * 1. Signing the preimage of the settled invoice of the settled link
     * 2. Setting the minSats to +1 over the settled invoice value
     * 3. Constructing the Link object
     * @param settled
     * @returns
     */
    public async createFromSettled(settled: Link): Promise<Link> {
        // create our signature from the settled preimage
        const nextSignature = await this.signer.sign(settled.next);

        // calc the min acceptable invoice
        const minSats = Number(settled.invoice.valueSat) + 1;

        // create the new link from the previous preimage, signature, and sats
        return new Link(settled.next, nextSignature, minSats);
    }
}
