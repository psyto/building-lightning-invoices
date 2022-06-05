import { CreateInvoiceResult } from "./CreateInvoiceResult";
import { LndInvoiceRepository } from "./lnd/LndInvoiceRepository";
import { LndMessageSigner } from "./lnd/LndMessageSigner";
import { createPreimage } from "./util/CreatePreimage";
import { AppInvoice } from "./AppInvoice";
import { AppInfo } from "./AppInfo";

export class AppController {
    public chain: string[];
    public invoices: AppInvoice[];
    public signatures: string[];
    public infos: AppInfo[];
    public receiver: (info: AppInfo) => void;

    public get chainTip(): string {
        return this.chain[this.chain.length - 1];
    }

    public get chainTipSignature(): string {
        return this.signatures[this.signatures.length - 1];
    }

    constructor(
        readonly invoiceRepository: LndInvoiceRepository,
        readonly signer: LndMessageSigner,
    ) {
        this.infos = [];
        this.invoices = [];
        this.chain = [];
        this.signatures = [];
        this.invoiceRepository.addHandler(this.handleInvoice.bind(this));
    }

    public async start() {
        // Initialize to 32 zero bytes
        this.chain.push(Buffer.alloc(32).toString("hex"));

        // Create our first signature for the
        this.signatures.push(await this.signChainTip());

        // initiate synchronization of invoices
        await this.invoiceRepository.sync();
    }

    public async signChainTip(): Promise<string> {
        const firstSignature = await this.signer.sign(Buffer.from(this.chainTip));
        return firstSignature;
    }

    /**
     *
     * @param remoteSignature
     * @returns
     */
    public async createInvoice(remoteSignature: string): Promise<CreateInvoiceResult> {
        console.log("creating", this.chainTip, remoteSignature);
        const verification = await this.signer.verify(Buffer.from(this.chainTip), remoteSignature);

        if (!verification.valid) return { success: false, error: "Invalid signature" };

        const valueMsat = 50_000;
        const preimage = createPreimage(this.chainTipSignature, remoteSignature);
        const memo = "own_" + this.chainTip;
        return await this.invoiceRepository.addInvoice(valueMsat, memo, preimage);
    }

    public async handleInvoice(invoice: AppInvoice) {
        if (invoice.settled && invoice.memo.startsWith("own_")) {
            this.invoices.push(invoice);

            const info: AppInfo = {
                chain: this.chainTip,
                valueMsat: invoice.valueMsat,
                signature: this.chainTipSignature,
                next: invoice.preimage,
            };
            this.infos.push(info);
            this.chain.push(invoice.preimage);
            this.signatures.push(await this.signChainTip());

            if (this.receiver) {
                this.receiver(info);
            }

            console.log(
                "invoice",
                invoice.memo,
                "chain",
                this.chain.map(p => p),
                "signatures",
                this.signatures,
            );
        }
    }
}
