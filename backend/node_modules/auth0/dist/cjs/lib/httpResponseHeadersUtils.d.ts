export interface TokenQuotaLimit {
    quota: number;
    remaining: number;
    resetAfter: number;
}
export interface TokenQuotaBucket {
    perHour?: TokenQuotaLimit;
    perDay?: TokenQuotaLimit;
}
export declare class HttpResponseHeadersUtils {
    /**
     * Gets the client token quota limits from the provided headers.
     *
     * @param headers the HTTP response headers.
     * @return a TokenQuotaBucket containing client rate limits, or null if not present.
     */
    static getClientQuotaLimit(headers: Headers | Record<string, string>): TokenQuotaBucket | null;
    /**
     * Gets the organization token quota limits from the provided headers.
     *
     * @param headers the HTTP response headers.
     * @return a TokenQuotaBucket containing organization rate limits, or null if not present.
     */
    static getOrganizationQuotaLimit(headers: Headers | Record<string, string>): TokenQuotaBucket | null;
    /**
     * Parses a token quota string into a TokenQuotaBucket.
     *
     * @param tokenQuota the token quota string.
     * @return a TokenQuotaBucket containing parsed rate limits.
     */
    private static parseQuota;
}
