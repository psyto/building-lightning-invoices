import { CreateInvoiceResult } from "./CreateInvoiceResult";
import { LndInvoiceRepository } from "./lnd/LndInvoiceRepository";
import { LndMessageSigner } from "./lnd/LndMessageSigner";
import { createPreimage } from "./util/CreatePreimage";
import { Invoice } from "./Invoice";
import { Leader } from "./Leader";

export class AppController {
    public chain: Leader[];
    public receiver: (info: Leader) => void;

    public get chainTip(): Leader {
        return this.chain[this.chain.length - 1];
    }

    constructor(
        readonly invoiceRepository: LndInvoiceRepository,
        readonly signer: LndMessageSigner,
    ) {
        this.invoiceRepository.addHandler(this.handleInvoice.bind(this));
        this.chain = [];
    }

    public async start(seed: string) {
        const firstSignature = await this.signPreimage(seed);
        this.chain.push(new Leader(seed, firstSignature));

        // initiate synchronization of invoices
        await this.invoiceRepository.sync();
    }

    public async signPreimage(preimage: string): Promise<string> {
        const buffer = Buffer.from(preimage);
        return await this.signer.sign(buffer);
    }

    /**
     *
     * @param remoteSignature
     * @returns
     */
    public async createInvoice(
        remoteSignature: string,
        sats: number,
    ): Promise<CreateInvoiceResult> {
        console.log("creating", this.chainTip.identifier, remoteSignature);
        const verification = await this.signer.verify(
            Buffer.from(this.chainTip.identifier),
            remoteSignature,
        );

        if (!verification.valid) return { success: false, error: "Invalid signature" };

        const owner = verification.pubkey;
        const preimage = createPreimage(this.chainTip.localSignature, remoteSignature, sats);
        const memo = createMemo(this.chainTip.identifier, owner);
        return await this.invoiceRepository.addInvoice(sats, memo, preimage);
    }

    public async handleInvoice(invoice: Invoice) {
        if (invoice.settled && isAppInvoice(invoice.memo)) {
            const settled = this.chainTip;
            settled.invoice = invoice;
            settled.next = invoice.preimage;

            const nextValue = invoice.preimage;
            const nextSignature = await this.signPreimage(nextValue);
            this.chain.push(new Leader(nextValue, nextSignature));

            console.log(settled);

            if (this.receiver) {
                this.receiver(settled);
            }
        }
    }
}

function isAppInvoice(memo: string) {
    return memo.startsWith("buy_");
}

function createMemo(hash: string, nodeId: string) {
    return `buy_${hash}_${nodeId}`;
}
