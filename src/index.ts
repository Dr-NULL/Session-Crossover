import { Session } from './lib/interface';
export * from './lib/interface';

declare global {
  namespace Express {
    export interface Request {
      session: Session;
    }
  }
}
