import { CurrentSession } from '../current-session';

export interface QueueMemory<T = any> {
    [key: string]: CurrentSession<T>;    
}
