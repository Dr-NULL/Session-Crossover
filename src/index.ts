import { Session } from './lib/interface';
export * from './lib';

declare global {
  namespace Express {
    export interface Request {
      session: Session;
    }
  }
}
