import { InternalError } from '../interface';

export class DisposeFuncNotSetted extends Error implements InternalError {
    public get code(): string {
        return 'DISPNOTSET';
    }

    constructor() {
        super(`The current instance hasn\'t a dispose function setted`);
    }
}
