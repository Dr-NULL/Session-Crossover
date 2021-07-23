export interface Cookie {
    get name(): string;

    get value(): string;
    set value(v: string);
}
