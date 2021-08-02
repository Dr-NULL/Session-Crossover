export class InvalidHashLengthError extends Error {
    constructor();
    constructor(length: number);
    constructor(length?: number) {
        super('');
        
        if (typeof length === 'number') {
            this.message = `The "${length}" hash length isn't invalid. The accepted values are between 8 - 255.`;
        } else {
            this.message = `The hash length isn't invalid. The accepted values are between 8 - 255.`;
        }
    }
}
