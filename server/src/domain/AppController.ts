import { CreateInvoiceResult } from "./CreateInvoiceResult";
import { Lnd } from "./lnd/v0.12.1-beta/Types";
import { LndInvoiceRepository } from "./lnd/LndInvoiceRepository";
import { LndMessageSigner } from "./lnd/LndMessageSigner";
import { createPreimage } from "./util/CreatePreimage";

export class AppController {
    public chain: Buffer[];
    public signatures: string[];

    public get chainTip(): Buffer {
        return this.chain[this.chain.length - 1];
    }

    public get chainTipHex(): string {
        return this.chainTip.toString("hex");
    }

    public get chainTipSignature(): string {
        return this.signatures[this.signatures.length - 1];
    }

    constructor(
        readonly invoiceRepository: LndInvoiceRepository,
        readonly signer: LndMessageSigner,
    ) {
        this.chain = [];
        this.signatures = [];
        this.invoiceRepository.addHandler(this.handleInvoice.bind(this));
    }

    public async start() {
        // Initialize to 32 zero bytes
        this.chain.push(Buffer.alloc(32));

        // Create our first signature for the
        this.signatures.push(await this.signChainTip());

        // initiate synchronization of invoices
        await this.invoiceRepository.sync();
    }

    public async signChainTip(): Promise<string> {
        const firstSignature = await this.signer.sign(Buffer.from(this.chainTipHex));
        return firstSignature;
    }

    /**
     *
     * @param remoteSignature
     * @returns
     */
    public async createInvoice(remoteSignature: string): Promise<CreateInvoiceResult> {
        console.log("creating", this.chainTipHex, remoteSignature);
        const verification = await this.signer.verify(
            Buffer.from(this.chainTipHex),
            remoteSignature,
        );

        if (!verification.valid) return { success: false, error: "Invalid signature" };

        const valueMsat = 50_000;
        const preimage = createPreimage(this.chainTipSignature, remoteSignature);
        const memo = "own_" + this.chainTipHex;
        try {
            const paymentRequest = await this.invoiceRepository.addInvoice(
                valueMsat,
                memo,
                preimage,
            );
            return {
                success: true,
                paymentRequest,
            };
        } catch (ex) {
            return {
                success: false,
                error: ex.message,
            };
        }
    }

    public async handleInvoice(invoice: Lnd.Invoice) {
        if (invoice.settled && invoice.memo.startsWith("own_")) {
            this.chain.push(invoice.r_preimage);
            this.signatures.push(await this.signChainTip());

            console.log(
                "invoice",
                invoice.memo,
                "chain",
                this.chain.map(p => p.toString("hex")),
                "sigs",
                this.signatures,
            );
        }
    }
}
