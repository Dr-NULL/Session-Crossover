import { Manager } from './lib';
export { sessionCrossover, Manager } from './lib';

declare global {
  namespace Express {
    export interface Request {
      session: Manager;
    }
  }
}
