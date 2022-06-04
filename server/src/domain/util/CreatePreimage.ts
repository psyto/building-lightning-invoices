import { sha256 } from "./Sha256";

export function createPreimage(local: string, remote: string) {
    const input = Buffer.from(local + remote);
    return sha256(input);
}
