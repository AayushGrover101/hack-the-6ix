import * as runtime from '../../../lib/runtime.js';
const { BaseAPI } = runtime;
/**
 *
 */
export class ConnectionsManager extends BaseAPI {
    /**
     * Deletes a connection and all its users.
     *
     * Delete a connection
     *
     * @throws {RequiredError}
     */
    async delete(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/connections/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Deletes a scim configuration by its <code>connectionId</code>.
     *
     * Delete a connection's SCIM configuration
     *
     * @throws {RequiredError}
     */
    async deleteScimConfiguration(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/connections/{id}/scim-configuration`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Deletes a scim token by its connection <code>id</code> and <code>tokenId</code>.
     *
     * Delete a connection's SCIM token
     *
     * @throws {RequiredError}
     */
    async deleteScimToken(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id', 'tokenId']);
        const response = await this.request({
            path: `/connections/{id}/scim-configuration/tokens/{tokenId}`
                .replace('{id}', encodeURIComponent(String(requestParameters.id)))
                .replace('{tokenId}', encodeURIComponent(String(requestParameters.tokenId))),
            method: 'DELETE',
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Deletes a specified connection user by its email (you cannot delete all users from specific connection). Currently, only Database Connections are supported.
     *
     * Delete a connection user
     *
     * @throws {RequiredError}
     */
    async deleteUserByEmail(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id', 'email']);
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'email',
                config: {},
            },
        ]);
        const response = await this.request({
            path: `/connections/{id}/users`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            query: queryParameters,
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Retrieve all clients that have the specified <a href="https://auth0.com/docs/authenticate/identity-providers">connection</a> enabled.
     *
     * <b>Note</b>: The first time you call this endpoint, omit the <code>from</code> parameter. If there are more results, a <code>next</code> value is included in the response. You can use this for subsequent API calls. When <code>next</code> is no longer included in the response, no further results are remaining.
     *
     * Get enabled clients for a connection
     *
     * @throws {RequiredError}
     */
    async getEnabledClients(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'take',
                config: {},
            },
            {
                key: 'from',
                config: {},
            },
        ]);
        const response = await this.request({
            path: `/connections/{id}/clients`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    async getAll(requestParameters = {}, initOverrides) {
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'per_page',
                config: {},
            },
            {
                key: 'page',
                config: {},
            },
            {
                key: 'include_totals',
                config: {},
            },
            {
                key: 'from',
                config: {},
            },
            {
                key: 'take',
                config: {},
            },
            {
                key: 'strategy',
                config: {
                    isArray: true,
                    isCollectionFormatMulti: true,
                },
            },
            {
                key: 'domain_alias',
                config: {},
            },
            {
                key: 'name',
                config: {},
            },
            {
                key: 'fields',
                config: {},
            },
            {
                key: 'include_fields',
                config: {},
            },
        ]);
        const response = await this.request({
            path: `/connections`,
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Retrieve details for a specified <a href="https://auth0.com/docs/authenticate/identity-providers">connection</a> along with options that can be used for identity provider configuration.
     * Get a connection
     *
     * @throws {RequiredError}
     */
    async get(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'fields',
                config: {},
            },
            {
                key: 'include_fields',
                config: {},
            },
        ]);
        const response = await this.request({
            path: `/connections/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Retrieves a scim configuration's default mapping by its <code>connectionId</code>.
     *
     * Get a connection's default SCIM mapping
     *
     * @throws {RequiredError}
     */
    async getDefaultScimMapping(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/connections/{id}/scim-configuration/default-mapping`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Gets the connection keys for the Okta or OIDC connection strategy.
     *
     * Get connection keys
     *
     * @throws {RequiredError}
     */
    async getKeys(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/connections/{id}/keys`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Retrieves a scim configuration by its <code>connectionId</code>.
     *
     * Get a connection's SCIM configuration
     *
     * @throws {RequiredError}
     */
    async getScimConfiguration(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/connections/{id}/scim-configuration`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Retrieves all scim tokens by its connection <code>id</code>.
     *
     * Get a connection's SCIM tokens
     *
     * @throws {RequiredError}
     */
    async getScimTokens(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/connections/{id}/scim-configuration/tokens`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Retrieves the status of an ad/ldap connection referenced by its <code>ID</code>. <code>200 OK</code> http status code response is returned  when the connection is online, otherwise a <code>404</code> status code is returned along with an error message
     * Check connection status
     *
     * @throws {RequiredError}
     */
    async checkStatus(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/connections/{id}/status`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Update enabled clients for a connection
     *
     * @throws {RequiredError}
     */
    async updateEnabledClients(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/connections/{id}/clients`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Update details for a specific <a href="https://auth0.com/docs/authenticate/identity-providers">connection</a>, including option properties for identity provider configuration.
     *
     * <b>Note</b>: If you use the <code>options</code> parameter, the entire <code>options</code> object is overriden. To avoid partial data or other issues, ensure all parameters are present when using this option.
     * Update a connection
     *
     * @throws {RequiredError}
     */
    async update(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/connections/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Update a scim configuration by its <code>connectionId</code>.
     *
     * Patch a connection's SCIM configuration
     *
     * @throws {RequiredError}
     */
    async updateScimConfiguration(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/connections/{id}/scim-configuration`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Creates a new connection according to the JSON object received in <code>body</code>.
     *
     * Create a connection
     *
     * @throws {RequiredError}
     */
    async create(bodyParameters, initOverrides) {
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/connections`,
            method: 'POST',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Rotates the connection keys for the Okta or OIDC connection strategies.
     *
     * Rotate connection keys
     *
     * @throws {RequiredError}
     */
    async rotateKeys(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/connections/{id}/keys/rotate`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Create a scim configuration for a connection.
     *
     * Create a SCIM configuration
     *
     * @throws {RequiredError}
     */
    async createScimConfiguration(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/connections/{id}/scim-configuration`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Create a scim token for a scim client.
     *
     * Create a SCIM Token
     *
     * @throws {RequiredError}
     */
    async createScimToken(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/connections/{id}/scim-configuration/tokens`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
}
//# sourceMappingURL=connections-manager.js.map