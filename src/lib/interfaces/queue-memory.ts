import { CurrentSession } from '../current-session';

export interface QueueMemory {
    [key: string]: CurrentSession;    
}
