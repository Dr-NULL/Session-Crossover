export interface Current {
    expires: Date;
    load<T = any>(): Promise<T>;
    save<T = any>(data: T): Promise<void>;
}
