export interface Options {
    folder: string;
    expire: number;
    
    cookieName?: string;
    saltLength?: number;
    hashLength?: number;
}
