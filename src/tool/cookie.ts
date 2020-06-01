import { Request, Response } from 'express';

export interface CookieObject {
  [key: string]: string;
}

export function getCookies(req: Request) {
  // Skip cookie parsing
  const data: CookieObject = {}
  if (!req.headers.cookie) {
    return data
  }

  // Parse the cookies
  const arr = (req.headers.cookie as string).split(/;/gi)
  for (const row of arr) {
    const cell = row
      .split(/=/)
      .map(x => x.trim())

    data[cell[0]] = cell[1]
  }

  return data
}