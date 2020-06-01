import { Session } from './session';

export interface SessionManager {
  create: () => void;
  delete: () => void;
  current: Session;
}