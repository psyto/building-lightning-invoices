import { sha256 } from "./Sha256";

export function createPreimage(local: string, remote: string, sats: number) {
    const input = Buffer.from(local + remote + sats.toString());
    return sha256(input);
}
