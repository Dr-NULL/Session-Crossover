import { SessionManager } from './lib/interfaces/session-manager';

declare global {
  namespace Express {
    export interface Request {
      session: SessionManager;
    }
  }
}