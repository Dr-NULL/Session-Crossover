export { deploy } from "./lib/deploy"
import Secret from "./tool/secret"

export let encrypt = new Secret()
export let clocks: Array<{ id: string; timer: NodeJS.Timer }> = []

//Types
import { Session } from "./lib/session";
declare global {
    namespace Express {
        export interface Request{
            session: Session
        }
    }
}