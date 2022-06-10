import { IMessageSigner } from "../IMessageSigner";
import { VerifySignatureResult } from "../VerifySignatureResult";
import { ILndClient } from "./ILndClient";

export class LndMessageSigner implements IMessageSigner {
    constructor(readonly client: ILndClient) {}

    public async sign(msg: string): Promise<string> {
        const result = await this.client.signMessage(Buffer.from(msg));
        return result.signature;
    }

    public async verify(msg: Buffer, signature: string): Promise<VerifySignatureResult> {
        const result = await this.client.verifyMessage(msg, signature);
        return result;
    }
}
