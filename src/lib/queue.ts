import { Options, QueueMemory } from './interfaces';
import { CurrentSession } from './current-session';
import { Hasher } from '../tool/hasher';

export class Queue<T = any> {
    private _options: Options;
    private _memory: QueueMemory<T>;
    private _hasher: Hasher;

    constructor(options: Options) {
        this._options = options;
        this._memory = {};

        this._hasher = new Hasher();
        this._hasher.hashLength = 32;
        this._hasher.parallelism = 4;
    }

    some(hash:string): boolean {
        return !!this._memory[hash];
    }

    find(hash:string): CurrentSession<T> {
        return this._memory[hash];
    }

    async new(): Promise<CurrentSession<T>> {
        // Build the hash
        const time = Date.now();
        let hash: string;
        do {
            const resp = await this._hasher.hash(time);
            hash = resp.hash.toString('hex');
        } while (this.some(hash));

        // Create the instance
        const current = new CurrentSession(
            hash, this._options.expires,
            this._options.path
        );

        // Configure
        current.onExpires = this._destroy.bind(this);
        this._memory[hash] = current;
        return current;
    }

    private _destroy(hash: string): void {
        if (this._memory[hash]) {
            delete this._memory[hash];
        }
    }
}