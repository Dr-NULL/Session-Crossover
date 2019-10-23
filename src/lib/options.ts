export interface Options {
    /**Folder that will has the session files */
    path: string;
    /**Lifetime (in min) that will has the session */
    expires: number;
    /**Name of the cookie that will has on the client-side */
    cookieName?: string;
    /**`true` if you want to encrypt the ID into the client-side */
    isEncrypted?: boolean;
}