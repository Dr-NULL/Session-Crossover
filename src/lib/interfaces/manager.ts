import { Current } from './current';

export interface Manager {
    current<T = any>(): Current<T>;
    create(): Promise<void>;
    delete(): Promise<void>;
    rewind(): void;
}
