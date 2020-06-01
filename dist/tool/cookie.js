"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCookies(req) {
    // Skip cookie parsing
    const data = {};
    if (!req.headers.cookie) {
        return data;
    }
    // Parse the cookies
    const arr = req.headers.cookie.split(/;/gi);
    for (const row of arr) {
        const cell = row
            .split(/=/)
            .map(x => x.trim());
        data[cell[0]] = cell[1];
    }
    return data;
}
exports.getCookies = getCookies;
//# sourceMappingURL=cookie.js.map