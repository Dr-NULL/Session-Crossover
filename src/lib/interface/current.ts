export interface Current {
    expiresAt: Date;
    load<T = any>(): Promise<T>;
    save<T = any>(): Promise<T>;
}
