import * as runtime from '../../../lib/runtime.js';
const { BaseAPI } = runtime;
/**
 *
 */
export class FlowsManager extends BaseAPI {
    /**
     * Delete a flow
     *
     * @throws {RequiredError}
     */
    async delete(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/flows/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Delete a flow execution
     *
     * @throws {RequiredError}
     */
    async deleteExecution(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['flow_id', 'execution_id']);
        const response = await this.request({
            path: `/flows/{flow_id}/executions/{execution_id}`
                .replace('{flow_id}', encodeURIComponent(String(requestParameters.flow_id)))
                .replace('{execution_id}', encodeURIComponent(String(requestParameters.execution_id))),
            method: 'DELETE',
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Delete a Flows Vault connection
     *
     * @throws {RequiredError}
     */
    async deleteConnection(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/flows/vault/connections/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    async getAll(requestParameters = {}, initOverrides) {
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'page',
                config: {},
            },
            {
                key: 'per_page',
                config: {},
            },
            {
                key: 'include_totals',
                config: {},
            },
            {
                key: 'hydrate',
                config: {
                    isArray: true,
                    isCollectionFormatMulti: true,
                },
            },
            {
                key: 'synchronous',
                config: {},
            },
        ]);
        const response = await this.request({
            path: `/flows`,
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Get a flow
     *
     * @throws {RequiredError}
     */
    async get(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'hydrate',
                config: {
                    isArray: true,
                    isCollectionFormatMulti: true,
                },
            },
        ]);
        const response = await this.request({
            path: `/flows/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    async getAllExecutions(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['flow_id']);
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'page',
                config: {},
            },
            {
                key: 'per_page',
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
        ]);
        const response = await this.request({
            path: `/flows/{flow_id}/executions`.replace('{flow_id}', encodeURIComponent(String(requestParameters.flow_id))),
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Get a flow execution
     *
     * @throws {RequiredError}
     */
    async getExecution(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['flow_id', 'execution_id']);
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'hydrate',
                config: {
                    isArray: true,
                    isCollectionFormatMulti: true,
                },
            },
        ]);
        const response = await this.request({
            path: `/flows/{flow_id}/executions/{execution_id}`
                .replace('{flow_id}', encodeURIComponent(String(requestParameters.flow_id)))
                .replace('{execution_id}', encodeURIComponent(String(requestParameters.execution_id))),
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    async getAllConnections(requestParameters = {}, initOverrides) {
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'page',
                config: {},
            },
            {
                key: 'per_page',
                config: {},
            },
            {
                key: 'include_totals',
                config: {},
            },
        ]);
        const response = await this.request({
            path: `/flows/vault/connections`,
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Get a Flows Vault connection
     *
     * @throws {RequiredError}
     */
    async getConnection(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/flows/vault/connections/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Update a flow
     *
     * @throws {RequiredError}
     */
    async update(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/flows/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Update a Flows Vault connection
     *
     * @throws {RequiredError}
     */
    async updateConnection(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/flows/vault/connections/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Create a flow
     *
     * @throws {RequiredError}
     */
    async create(bodyParameters, initOverrides) {
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/flows`,
            method: 'POST',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Create a Flows Vault connection
     *
     * @throws {RequiredError}
     */
    async createConnection(bodyParameters, initOverrides) {
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/flows/vault/connections`,
            method: 'POST',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
}
//# sourceMappingURL=flows-manager.js.map