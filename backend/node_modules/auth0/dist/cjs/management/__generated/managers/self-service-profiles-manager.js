"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfServiceProfilesManager = void 0;
const runtime = __importStar(require("../../../lib/runtime.js"));
const { BaseAPI } = runtime;
/**
 *
 */
class SelfServiceProfilesManager extends BaseAPI {
    /**
     * Deletes a self-service profile by Id.
     * Delete a self-service profile by Id
     *
     * @throws {RequiredError}
     */
    async delete(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/self-service-profiles/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Retrieves text customizations for a given self-service profile, language and Self Service SSO Flow page.
     *
     * Get custom text for a self-service profile
     *
     * @throws {RequiredError}
     */
    async getCustomText(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id', 'language', 'page']);
        const response = await this.request({
            path: `/self-service-profiles/{id}/custom-text/{language}/{page}`
                .replace('{id}', encodeURIComponent(String(requestParameters.id)))
                .replace('{language}', encodeURIComponent(String(requestParameters.language)))
                .replace('{page}', encodeURIComponent(String(requestParameters.page))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
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
        ]);
        const response = await this.request({
            path: `/self-service-profiles`,
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Retrieves a self-service profile by Id.
     * Get a self-service profile by Id
     *
     * @throws {RequiredError}
     */
    async get(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const response = await this.request({
            path: `/self-service-profiles/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Updates a self-service profile.
     * Update a self-service profile
     *
     * @throws {RequiredError}
     */
    async update(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/self-service-profiles/{id}`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Revokes an SSO access ticket and invalidates associated sessions. The ticket will no longer be accepted to initiate a Self-Service SSO session. If any users have already started a session through this ticket, their session will be terminated. Clients should expect a `202 Accepted` response upon successful processing, indicating that the request has been acknowledged and that the revocation is underway but may not be fully completed at the time of response. If the specified ticket does not exist, a `202 Accepted` response is also returned, signaling that no further action is required.
     * Clients should treat these `202` responses as an acknowledgment that the request has been accepted and is in progress, even if the ticket was not found.
     *
     * Revoke an SSO access ticket
     *
     * @throws {RequiredError}
     */
    async revokeSsoTicket(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['profileId', 'id']);
        const response = await this.request({
            path: `/self-service-profiles/{profileId}/sso-ticket/{id}/revoke`
                .replace('{profileId}', encodeURIComponent(String(requestParameters.profileId)))
                .replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
        }, initOverrides);
        return runtime.TextApiResponse.fromResponse(response);
    }
    /**
     * Creates a self-service profile. Currently only one profile can be created per tenant.
     * Create a self-service profile
     *
     * @throws {RequiredError}
     */
    async create(bodyParameters, initOverrides) {
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/self-service-profiles`,
            method: 'POST',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Creates an SSO access ticket to initiate the Self Service SSO Flow using a self-service profile.
     *
     * Create an SSO access ticket to initiate the Self Service SSO Flow
     *
     * @throws {RequiredError}
     */
    async createSsoTicket(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/self-service-profiles/{id}/sso-ticket`.replace('{id}', encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Updates text customizations for a given self-service profile, language and Self Service SSO Flow page.
     *
     * Set custom text for a self-service profile
     *
     * @throws {RequiredError}
     */
    async updateCustomText(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['id', 'language', 'page']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/self-service-profiles/{id}/custom-text/{language}/{page}`
                .replace('{id}', encodeURIComponent(String(requestParameters.id)))
                .replace('{language}', encodeURIComponent(String(requestParameters.language)))
                .replace('{page}', encodeURIComponent(String(requestParameters.page))),
            method: 'PUT',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
}
exports.SelfServiceProfilesManager = SelfServiceProfilesManager;
//# sourceMappingURL=self-service-profiles-manager.js.map