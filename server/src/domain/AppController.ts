import { CreateInvoiceResult } from "./CreateInvoiceResult";
import { Invoice } from "./Invoice";
import { Leader } from "./Leader";
import { LeaderFactory } from "./LeaderFactory";
import { IInvoiceDataMapper } from "./IInvoiceDataMapper";
import { IMessageSigner } from "./IMessageSigner";

export class AppController {
    public chain: Leader[];
    public receiver: (info: Leader[]) => void;

    public get chainTip(): Leader {
        return this.chain[this.chain.length - 1];
    }

    constructor(
        readonly invoiceDataMapper: IInvoiceDataMapper,
        readonly signer: IMessageSigner,
        readonly leaderFactor: LeaderFactory,
    ) {
        this.invoiceDataMapper.addHandler(this.handleInvoice.bind(this));
        this.chain = [];
    }

    /**
     * Starts the application by creating the initial link and
     * synchronizing against the invoice repository
     * @param seed
     * @param startSats
     */
    public async start(seed: string, startSats: number) {
        // create the initial link in the ownership chain
        const firstLink = await this.leaderFactor.createFromSeed(seed, startSats);
        this.chain.push(firstLink);

        // initiate synchronization of invoices
        await this.invoiceDataMapper.sync();
    }

    /**
     * Creates an invoice
     * @param remoteSignature
     * @returns
     */
    public async createInvoice(
        remoteSignature: string,
        sats: number,
    ): Promise<CreateInvoiceResult> {
        // verify the invoice provided by the user
        const verification = await this.signer.verify(
            Buffer.from(this.chainTip.identifier),
            remoteSignature,
        );

        // return failure if signature fails
        if (!verification.valid) {
            return { success: false, error: "Invalid signature" };
        }

        const owner = verification.pubkey;
        const preimage = Invoice.createPreimage(
            this.chainTip.localSignature,
            remoteSignature,
            sats,
        );
        const memo = Invoice.createMemo(this.chainTip.identifier, owner);
        return await this.invoiceDataMapper.add(sats, memo, preimage);
    }

    public async handleInvoice(invoice: Invoice) {
        if (invoice.settles(this.chainTip)) {
            // settle the current chain tip
            const settled = this.chainTip;
            settled.settle(invoice);

            // create the next blank link
            const nextLink = await this.leaderFactor.createFromSettled(settled);
            this.chain.push(nextLink);

            // send to
            if (this.receiver) {
                this.receiver([settled, nextLink]);
            }
        }
    }
}
