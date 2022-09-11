/**
 * Bytes array to hex string
 */
export function bytesToHex(byteArray: number[] | Uint8Array) {
    return Array.from(byteArray, (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('');
}

/**
 * Hex string to bytes array
 */

