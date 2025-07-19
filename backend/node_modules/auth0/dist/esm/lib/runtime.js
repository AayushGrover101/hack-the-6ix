import { retry } from './retry.js';
import { FetchError, RequiredError, TimeoutError } from './errors.js';
export * from './models.js';
/**
 * @private
 * This is the base class for all generated API classes.
 */
export class BaseAPI {
    constructor(configuration) {
        this.configuration = configuration;
        this.fetchWithTimeout = async (url, init) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, this.timeoutDuration);
            try {
                return await this.fetchApi(url, { signal: controller.signal, ...init });
            }
            catch (e) {
                if (e.name === 'AbortError') {
                    throw new TimeoutError();
                }
                throw e;
            }
            finally {
                clearTimeout(timeout);
            }
        };
        this.fetch = async (url, init) => {
            var _a, _b;
            let fetchParams = { url, init };
            for (const middleware of this.middleware) {
                if (middleware.pre) {
                    fetchParams =
                        (await middleware.pre({
                            fetch: this.fetchWithTimeout,
                            ...fetchParams,
                        })) || fetchParams;
                }
            }
            let response = undefined;
            let error = undefined;
            try {
                response =
                    ((_a = this.configuration.retry) === null || _a === void 0 ? void 0 : _a.enabled) !== false
                        ? await retry(() => this.fetchWithTimeout(fetchParams.url, fetchParams.init), {
                            ...this.configuration.retry,
                        })
                        : await this.fetchWithTimeout(fetchParams.url, fetchParams.init);
            }
            catch (e) {
                error = e;
            }
            if (error || !response.ok) {
                for (const middleware of this.middleware) {
                    if (middleware.onError) {
                        response =
                            (await middleware.onError({
                                fetch: this.fetchWithTimeout,
                                ...fetchParams,
                                error,
                                response: response ? response.clone() : undefined,
                            })) || response;
                    }
                }
                if (response === undefined) {
                    throw new FetchError(error, (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : 'The request failed and the interceptors did not return an alternative response');
                }
            }
            else {
                for (const middleware of this.middleware) {
                    if (middleware.post) {
                        response =
                            (await middleware.post({
                                fetch: this.fetchApi,
                                ...fetchParams,
                                response: response.clone(),
                            })) || response;
                    }
                }
            }
            return response;
        };
        if (configuration.baseUrl === null || configuration.baseUrl === undefined) {
            throw new Error('Must provide a base URL for the API');
        }
        if ('string' !== typeof configuration.baseUrl || configuration.baseUrl.length === 0) {
            throw new Error('The provided base URL is invalid');
        }
        this.middleware = configuration.middleware || [];
        this.fetchApi = configuration.fetch || globalThis.fetch.bind(globalThis);
        this.parseError = configuration.parseError;
        this.timeoutDuration =
            typeof configuration.timeoutDuration === 'number' ? configuration.timeoutDuration : 10000;
    }
    async request(context, initOverrides) {
        const { url, init } = await this.createFetchParams(context, initOverrides);
        const response = await this.fetch(url, init);
        if (response && response.status >= 200 && response.status < 300) {
            return response;
        }
        const error = await this.parseError(response);
        throw error;
    }
    async createFetchParams(context, initOverrides) {
        let url = this.configuration.baseUrl + context.path;
        if (context.query !== undefined && Object.keys(context.query).length !== 0) {
            // only add the querystring to the URL if there are query parameters.
            // this is done to avoid urls ending with a "?" character which buggy webservers
            // do not handle correctly sometimes.
            url += `?${querystring(context.query)}`;
        }
        const headers = Object.assign({}, this.configuration.headers, context.headers);
        Object.keys(headers).forEach((key) => (headers[key] === undefined ? delete headers[key] : {}));
        const initOverrideFn = typeof initOverrides === 'function' ? initOverrides : async () => initOverrides;
        const initParams = {
            method: context.method,
            headers,
            body: context.body,
            dispatcher: this.configuration.agent,
        };
        const overriddenInit = {
            ...initParams,
            ...(await initOverrideFn({
                init: initParams,
                context,
            })),
        };
        const init = {
            ...overriddenInit,
            body: overriddenInit.body instanceof FormData ||
                overriddenInit.body instanceof URLSearchParams ||
                overriddenInit.body instanceof Blob
                ? overriddenInit.body
                : JSON.stringify(overriddenInit.body),
        };
        return { url, init };
    }
}
/**
 * @private
 */
export const COLLECTION_FORMATS = {
    csv: ',',
    ssv: ' ',
    tsv: '\t',
    pipes: '|',
};
/**
 * @private
 */
function querystring(params) {
    return Object.keys(params)
        .map((key) => querystringSingleKey(key, params[key]))
        .filter((part) => part.length > 0)
        .join('&');
}
function querystringSingleKey(key, value) {
    if (value instanceof Array) {
        const multiValue = value
            .map((singleValue) => encodeURIComponent(String(singleValue)))
            .join(`&${encodeURIComponent(key)}=`);
        return `${encodeURIComponent(key)}=${multiValue}`;
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
}
/**
 * @private
 */
export function validateRequiredRequestParams(requestParameters, keys) {
    keys.forEach((key) => {
        if (requestParameters[key] === null || requestParameters[key] === undefined) {
            throw new RequiredError(key, `Required parameter requestParameters.${key} was null or undefined.`);
        }
    });
}
/**
 * @private
 */
export function applyQueryParams(requestParameters, keys) {
    return keys.reduce((acc, { key, config, }) => {
        let value;
        if (config.isArray) {
            if (config.isCollectionFormatMulti) {
                value = requestParameters[key];
            }
            else {
                value = requestParameters[key].join(COLLECTION_FORMATS[config.collectionFormat]);
            }
        }
        else {
            if (requestParameters[key] !== undefined) {
                value = requestParameters[key];
            }
        }
        return value !== undefined ? { ...acc, [key]: value } : acc;
    }, {});
}
// Pre-compiled regex for matching whitelisted paths
const compiledWhitelistedPathRegexes = compileWhitelistedPathPatterns();
// Function to compile the whitelisted patterns
function compileWhitelistedPathPatterns() {
    const patterns = [
        '^/api/v2/jobs/verification-email$',
        '^/api/v2/tickets/email-verification$',
        '^/api/v2/tickets/password-change$',
        '^/api/v2/organizations/[^/]+/invitations$',
        '^/api/v2/users$',
        '^/api/v2/users/[^/]+$',
        '^/api/v2/guardian/enrollments/ticket$',
    ];
    return patterns.map((pattern) => new RegExp(pattern));
}
// Function to check if the path matches any whitelisted pattern
function isCustomDomainPathWhitelisted(path) {
    return compiledWhitelistedPathRegexes.some((regex) => regex.test(path));
}
// Function to create the custom domain header for a request
export function CustomDomainHeader(domain) {
    return async ({ init, context }) => {
        const headers = { ...init.headers };
        // Only add the custom domain header for whitelisted paths
        const formattedPath = context.path.startsWith('/api/v2/')
            ? context.path
            : `/api/v2${context.path}`;
        if (isCustomDomainPathWhitelisted(formattedPath)) {
            headers['auth0-custom-domain'] = domain;
        }
        // Return the updated init with custom domain header if needed
        return { ...init, headers: headers };
    };
}
/**
 * @private
 */
export async function parseFormParam(originalValue) {
    let value = originalValue;
    value = typeof value == 'number' || typeof value == 'boolean' ? '' + value : value;
    return value;
}
//# sourceMappingURL=runtime.js.map