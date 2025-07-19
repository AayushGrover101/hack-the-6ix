export class HttpResponseHeadersUtils {
    /**
     * Gets the client token quota limits from the provided headers.
     *
     * @param headers the HTTP response headers.
     * @return a TokenQuotaBucket containing client rate limits, or null if not present.
     */
    static getClientQuotaLimit(headers) {
        const getHeaderValue = (key) => {
            if (headers instanceof Headers) {
                return headers.get(key);
            }
            return headers[key] || null;
        };
        const quotaHeader = getHeaderValue('auth0-client-quota-limit');
        return quotaHeader ? this.parseQuota(quotaHeader) : null;
    }
    /**
     * Gets the organization token quota limits from the provided headers.
     *
     * @param headers the HTTP response headers.
     * @return a TokenQuotaBucket containing organization rate limits, or null if not present.
     */
    static getOrganizationQuotaLimit(headers) {
        const getHeaderValue = (key) => {
            if (headers instanceof Headers) {
                return headers.get(key);
            }
            return headers[key] || null;
        };
        const quotaHeader = getHeaderValue('auth0-organization-quota-limit');
        return quotaHeader ? this.parseQuota(quotaHeader) : null;
    }
    /**
     * Parses a token quota string into a TokenQuotaBucket.
     *
     * @param tokenQuota the token quota string.
     * @return a TokenQuotaBucket containing parsed rate limits.
     */
    static parseQuota(tokenQuota) {
        let perHour;
        let perDay;
        const parts = tokenQuota.split(',');
        for (const part of parts) {
            const attributes = part.split(';');
            let quota = 0, remaining = 0, resetAfter = 0;
            for (const attribute of attributes) {
                const [key, value] = attribute.split('=').map((s) => s.trim());
                if (!key || !value)
                    continue;
                switch (key) {
                    case 'q':
                        quota = parseInt(value, 10);
                        break;
                    case 'r':
                        remaining = parseInt(value, 10);
                        break;
                    case 't':
                        resetAfter = parseInt(value, 10);
                        break;
                }
            }
            if (attributes.length > 0 && attributes[0].includes('per_hour')) {
                perHour = { quota, remaining, resetAfter };
            }
            else if (attributes.length > 0 && attributes[0].includes('per_day')) {
                perDay = { quota, remaining, resetAfter };
            }
        }
        return { perHour, perDay };
    }
}
//# sourceMappingURL=httpResponseHeadersUtils.js.map