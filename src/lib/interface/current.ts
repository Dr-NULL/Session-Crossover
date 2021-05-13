export interface Current {
    expiresAt: Date;
    load<T = any>(): Promise<T>;
    save<T = any>(data: T): Promise<void>;
}
