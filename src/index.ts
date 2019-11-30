export { deploy as crossover } from "./lib/deploy"

//Types
import { Session } from "./lib/session";
declare global {
    namespace Express {
        export interface Request{
            session: Session
        }
    }
}