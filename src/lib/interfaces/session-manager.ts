import { Session } from './session';

export interface SessionManager {
  /**
   * Resets the expiration countdodwn.
   * @param min [optional] new time duration (in minutes).
   */
  rewind: (min?: number) => void;

  /**
   * Create a new session, and create its instance in `this.current`.
   */
  create: () => void;

  /**
   * Delete the current session, and set `this.current = undefined`.
   */
  delete: () => void;

  /**
   * The current session instance. If this connection doesn't has a session, 
   * this property will be `undefined`.
   */
  current: Session;
}