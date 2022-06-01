/**
 * Performs byte-wise exclusive-OR on two buffers of equal length returning
 * a new Bufffer. Throws when the buffers are not equal length.
 * @param a
 * @param b
 * @returns
 */
export function xor(a: Buffer, b: Buffer): Buffer {
    if (a.length !== b.length) {
        throw new Error("Requires equal length Buffers");
    }

    const result = Buffer.alloc(a.length);
    for (let i = 0; i < a.length; i++) {
        result[i] = a[i] ^ b[i];
    }
    return result;
}
