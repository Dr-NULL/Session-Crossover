export interface Current<T = any> {
    value: T;
    save(): Promise<void>;
    rewind(): void;
}
