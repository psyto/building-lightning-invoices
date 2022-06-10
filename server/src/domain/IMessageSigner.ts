import { VerifySignatureResult } from "./VerifySignatureResult";

export interface IMessageSigner {
    sign(msg: string): Promise<string>;
    verify(msg: Buffer, signature: string): Promise<VerifySignatureResult>;
}
