export interface Options {
    /**Carpeta en la cual se guardarán los datos */
    path: string;
    /**Tiempo de vida de la sesión (min) */
    expires: number;
    /**Nombre de la cookie que contendrá la función */
    cookieName?: string;
    /**Encriptar o no el archivo */
    encrypted?: boolean;
}