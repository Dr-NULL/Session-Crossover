export interface Session {
    /**
     * The creation date of the current session.
     */
    readonly created: Date;
    /**
     * The expiration date of the current session.
     */
    readonly expires: Date;
    /**
     * Get the session's data.
     */
    getData: <T = any>() => T;
    /**
     * Set the session's data.
     */
    setData: <T = any>(data: T) => void;
}
//# sourceMappingURL=session.d.ts.map