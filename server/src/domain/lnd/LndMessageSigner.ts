import { ILndClient } from "./ILndClient";
import { Lnd } from "./v0.12.1-beta/Types";

export class LndMessageSigner {
    constructor(readonly client: ILndClient) {}

    public async sign(msg: string): Promise<string> {
        const result = await this.client.signMessage(Buffer.from(msg));
        return result.signature;
    }

    public async verify(msg: Buffer, signature: string): Promise<Lnd.VerifyMessageResponse> {
        const result = await this.client.verifyMessage(msg, signature);
        return result;
    }
}
