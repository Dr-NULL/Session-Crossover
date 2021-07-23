export interface Manager {
    current(): Promise<any>;
    rewind(): Promise<void>;
    create(): Promise<void>;
}
