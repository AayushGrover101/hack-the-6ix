/**
 * @private
 */
export declare const generateClientInfo: () => {
    name: string;
    version: string;
    env: {
        [x: string]: string;
    };
};
/**
 * @private
 */
export declare const mtlsPrefix = "mtls";
type SyncGetter<T> = () => T;
type AsyncGetter<T> = () => Promise<T>;
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
export declare const resolveValueToPromise: <T>(value: T | SyncGetter<T> | AsyncGetter<T>) => Promise<T>;
export {};
