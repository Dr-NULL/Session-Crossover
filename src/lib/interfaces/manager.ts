import { Current } from './current';

export interface Manager<T = any> {
    readonly current: Current<T>;
    create(): Promise<void>;
    delete(): Promise<void>;
}
