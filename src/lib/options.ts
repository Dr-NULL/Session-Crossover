export interface Options {
    /**Folder that will has the session files */
    path: string;
    /**Lifetime (in min) that will has the session */
    expires: number;
    /**Name of the cookie that will has on the client-side */
    cookieName?: string;
    /**`true` if you want to encrypt the ID into the client-side */
    isEncrypted?: boolean;
    /**A function that will be executes when the current sesion expires
     * @param data The saved value stored into the session
    */
    whenDies?: (data: any) => void;
}