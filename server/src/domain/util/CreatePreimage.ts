import { sha256 } from "./Sha256";

export function createPreimage(previous: string, signature: string) {
    const input = Buffer.concat([Buffer.from(previous, "hex"), Buffer.from(signature)]);
    return sha256(input);
}
