import { Middleware, Options } from './interface';
import { rmSync } from 'fs';
import express from 'express';

export function deploy(options: Options): Middleware {
    let count = 0;

    return async (req, res, nxt) => {
        console.log('count ->', ++count);
        nxt();
    };
}
