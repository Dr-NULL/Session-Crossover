import { Current, Session } from './interface';

export class Manager implements Session {
    current?: Current;

    create: () => Promise<any>;
    revert: () => Promise<any>;
    delete: () => Promise<any>;
    
}