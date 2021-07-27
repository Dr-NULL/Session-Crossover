export interface Current<T = any> {
    load(): Promise<T>;
    save(value: T): Promise<void>;
    rewind(): void;
}
