/**
 * Converts the input value into a Buffer. 
 * @param input the input that will used to be converted into a Buffer.
 */
export function toBuffer(input: string | number | Buffer): Buffer {
    if (typeof input === 'string') {
        return Buffer.from(input);
    } else if (typeof input === 'number') {
        return Buffer.from(input.toString());
    } else {
        return input;
    }
}