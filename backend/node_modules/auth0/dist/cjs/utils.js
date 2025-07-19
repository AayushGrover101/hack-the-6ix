"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveValueToPromise = exports.mtlsPrefix = exports.generateClientInfo = void 0;
const version_js_1 = require("./version.js");
/* eslint-disable @typescript-eslint/ban-ts-comment */
function detectRuntime() {
    var _a;
    // Node.js
    if (typeof process !== 'undefined' && ((_a = process.versions) === null || _a === void 0 ? void 0 : _a.node)) {
        return 'node';
    }
    // Cloudflare Workers
    if (typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers') {
        return 'cloudflare-workers';
    }
    // Deno
    // @ts-ignore
    if (typeof Deno !== 'undefined') {
        return 'deno';
    }
    return 'unknown';
}
/**
 * @private
 */
const generateClientInfo = () => {
    var _a, _b;
    const runtime = detectRuntime();
    return {
        name: 'node-auth0',
        version: version_js_1.version,
        env: {
            [runtime]: (_b = (_a = process.version) === null || _a === void 0 ? void 0 : _a.replace('v', '')) !== null && _b !== void 0 ? _b : 'unknown',
        },
    };
};
exports.generateClientInfo = generateClientInfo;
/**
 * @private
 */
exports.mtlsPrefix = 'mtls';
/**
 * Resolves a value that can be a static value, a synchronous function, or an asynchronous function.
 *
 * @template T - The type of the value to be resolved.
 * @param {T | SyncGetter<T> | AsyncGetter<T>} value - The value to be resolved. It can be:
 *   - A static value of type T.
 *   - A synchronous function that returns a value of type T.
 *   - An asynchronous function that returns a Promise of type T.
 * @returns {Promise<T>} A promise that resolves to the value of type T.
 */
const resolveValueToPromise = async (value) => {
    if (typeof value === 'function') {
        const result = value(); // Call the function
        return result instanceof Promise ? result : Promise.resolve(result); // Handle sync/async
    }
    return Promise.resolve(value); // Static value
};
exports.resolveValueToPromise = resolveValueToPromise;
//# sourceMappingURL=utils.js.map