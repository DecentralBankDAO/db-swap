/**
 * Bytes array to hex string
 */
export function bytesToHex(byteArray: number[] | Uint8Array) {
    return Array.from(byteArray, (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('');
}

/**
 * Hex string to bytes array
 */
export function hexToBytes(hex: string) {
    const bytes = [];

    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substring(c, 2), 16));
    }

    return bytes;
}
