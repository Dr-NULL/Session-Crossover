import { ModuleError } from '../interface';

export class SessionNotFound extends Error implements ModuleError {
    static readonly code = 'NOTFOUND';
    public get code(): string {
        return SessionNotFound.code;
    }

    constructor(hash?: string) {
        super();

        if (!hash) {
            this.message = 'The current session wasn\'t found';
        } else {
            this.message = `The current session with hash "${hash}" wasn\'t found`;
        }
    }
}
