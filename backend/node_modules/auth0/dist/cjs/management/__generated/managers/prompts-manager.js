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
exports.PromptsManager = void 0;
const runtime = __importStar(require("../../../lib/runtime.js"));
const { BaseAPI } = runtime;
/**
 *
 */
class PromptsManager extends BaseAPI {
    async getAllRenderingSettings(requestParameters = {}, initOverrides) {
        const queryParameters = runtime.applyQueryParams(requestParameters, [
            {
                key: 'fields',
                config: {},
            },
            {
                key: 'include_fields',
                config: {},
            },
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
                key: 'prompt',
                config: {},
            },
            {
                key: 'screen',
                config: {},
            },
            {
                key: 'rendering_mode',
                config: {},
            },
        ]);
        const response = await this.request({
            path: `/prompts/rendering`,
            method: 'GET',
            query: queryParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Retrieve custom text for a specific prompt and language.
     * Get custom text for a prompt
     *
     * @throws {RequiredError}
     */
    async getCustomTextByLanguage(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['prompt', 'language']);
        const response = await this.request({
            path: `/prompts/{prompt}/custom-text/{language}`
                .replace('{prompt}', encodeURIComponent(String(requestParameters.prompt)))
                .replace('{language}', encodeURIComponent(String(requestParameters.language))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Get template partials for a prompt
     * Get partials for a prompt
     *
     * @throws {RequiredError}
     */
    async getPartials(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['prompt']);
        const response = await this.request({
            path: `/prompts/{prompt}/partials`.replace('{prompt}', encodeURIComponent(String(requestParameters.prompt))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Retrieve details of the Universal Login configuration of your tenant. This includes the <a href="https://auth0.com/docs/authenticate/login/auth0-universal-login/identifier-first">Identifier First Authentication</a> and <a href="https://auth0.com/docs/secure/multi-factor-authentication/fido-authentication-with-webauthn/configure-webauthn-device-biometrics-for-mfa">WebAuthn with Device Biometrics for MFA</a> features.
     * Get prompt settings
     *
     * @throws {RequiredError}
     */
    async get(initOverrides) {
        const response = await this.request({
            path: `/prompts`,
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Get render settings for a screen.
     * Get render settings for a screen
     *
     * @throws {RequiredError}
     */
    async getRendering(requestParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['prompt', 'screen']);
        const response = await this.request({
            path: `/prompts/{prompt}/screen/{screen}/rendering`
                .replace('{prompt}', encodeURIComponent(String(requestParameters.prompt)))
                .replace('{screen}', encodeURIComponent(String(requestParameters.screen))),
            method: 'GET',
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Update the Universal Login configuration of your tenant. This includes the <a href="https://auth0.com/docs/authenticate/login/auth0-universal-login/identifier-first">Identifier First Authentication</a> and <a href="https://auth0.com/docs/secure/multi-factor-authentication/fido-authentication-with-webauthn/configure-webauthn-device-biometrics-for-mfa">WebAuthn with Device Biometrics for MFA</a> features.
     * Update prompt settings
     *
     * @throws {RequiredError}
     */
    async update(bodyParameters, initOverrides) {
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/prompts`,
            method: 'PATCH',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Learn more about <a href='https://auth0.com/docs/customize/login-pages/advanced-customizations/getting-started/configure-acul-screens'>configuring render settings</a> for advanced customization.
     *
     * <p>
     *   Example <code>head_tags</code> array. See our <a href='https://auth0.com/docs/customize/login-pages/advanced-customizations/getting-started/configure-acul-screens'>documentation</a> on using Liquid variables within head tags.
     * </p>
     * <pre>{
     *   "head_tags": [
     *     {
     *       "tag": "script",
     *       "attributes": {
     *         "defer": true,
     *         "src": "URL_TO_ASSET",
     *         "async": true,
     *         "integrity": [
     *           "ASSET_SHA"
     *         ]
     *       }
     *     },
     *     {
     *       "tag": "link",
     *       "attributes": {
     *         "href": "URL_TO_ASSET",
     *         "rel": "stylesheet"
     *       }
     *     }
     *   ]
     * }
     * </pre>
     *
     * Update render settings for a screen
     *
     * @throws {RequiredError}
     */
    async updateRendering(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['prompt', 'screen']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/prompts/{prompt}/screen/{screen}/rendering`
                .replace('{prompt}', encodeURIComponent(String(requestParameters.prompt)))
                .replace('{screen}', encodeURIComponent(String(requestParameters.screen))),
            method: 'PATCH',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.JSONApiResponse.fromResponse(response);
    }
    /**
     * Set custom text for a specific prompt. Existing texts will be overwritten.
     * Set custom text for a specific prompt
     *
     * @throws {RequiredError}
     */
    async updateCustomTextByLanguage(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['prompt', 'language']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/prompts/{prompt}/custom-text/{language}`
                .replace('{prompt}', encodeURIComponent(String(requestParameters.prompt)))
                .replace('{language}', encodeURIComponent(String(requestParameters.language))),
            method: 'PUT',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
    /**
     * Set template partials for a prompt
     * Set partials for a prompt
     *
     * @throws {RequiredError}
     */
    async updatePartials(requestParameters, bodyParameters, initOverrides) {
        runtime.validateRequiredRequestParams(requestParameters, ['prompt']);
        const headerParameters = {};
        headerParameters['Content-Type'] = 'application/json';
        const response = await this.request({
            path: `/prompts/{prompt}/partials`.replace('{prompt}', encodeURIComponent(String(requestParameters.prompt))),
            method: 'PUT',
            headers: headerParameters,
            body: bodyParameters,
        }, initOverrides);
        return runtime.VoidApiResponse.fromResponse(response);
    }
}
exports.PromptsManager = PromptsManager;
//# sourceMappingURL=prompts-manager.js.map