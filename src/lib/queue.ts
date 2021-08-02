import { Options, QueueMemory } from './interfaces';
import { CurrentSession } from './current-session';
import { v4 as uuidV4 } from 'uuid';

export class Queue {
    private _options: Options;
    private _memory: QueueMemory;

    constructor(options: Options) {
        this._options = options;
        this._memory = {};
    }

    some(hash:string): boolean {
        return !!this._memory[hash];
    }

    find(hash:string): CurrentSession {
        return this._memory[hash];
    }

    async new(): Promise<CurrentSession> {
        // Build the hash
        let uuid: string;
        do {
            uuid = uuidV4();
        } while (this.some(uuid));

        // Create the instance
        const current = new CurrentSession(
            uuid, this._options.expires,
            this._options.path
        );

        // Configure
        current.onDestroy = this._destroy.bind(this);
        this._memory[uuid] = current;
        return current;
    }

    private _destroy(hash: string): void {
        if (this._memory[hash]) {
            delete this._memory[hash];
        }
    }
}