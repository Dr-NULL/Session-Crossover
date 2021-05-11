import { Current } from './current';

export interface Session {
    create: () => Promise<any>;
    revert: () => Promise<any>;
    delete: () => Promise<any>;
    current?: Current;
}
