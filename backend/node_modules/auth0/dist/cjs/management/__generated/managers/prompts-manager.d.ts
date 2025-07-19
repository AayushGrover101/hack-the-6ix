import * as runtime from '../../../lib/runtime.js';
import type { InitOverride, ApiResponse } from '../../../lib/runtime.js';
import type { GetRendering200Response, PatchRendering200Response, PatchRenderingRequest, PromptsSettings, PromptsSettingsUpdate, GetAllRendering200ResponseOneOf, GetAllRendering200ResponseOneOfInner, GetAllRenderingRequest, GetCustomTextByLanguageRequest, GetPartialsRequest, GetRenderingRequest, PatchRenderingOperationRequest, PutCustomTextByLanguageRequest, PutPartialsRequest } from '../models/index.js';
declare const BaseAPI: typeof runtime.BaseAPI;
/**
 *
 */
export declare class PromptsManager extends BaseAPI {
    /**
     * Get render setting configurations for all screens.
     * Get render setting configurations for all screens
     *
     * @throws {RequiredError}
     */
    getAllRenderingSettings(requestParameters: GetAllRenderingRequest & {
        include_totals: true;
    }, initOverrides?: InitOverride): Promise<ApiResponse<GetAllRendering200ResponseOneOf>>;
    getAllRenderingSettings(requestParameters?: GetAllRenderingRequest, initOverrides?: InitOverride): Promise<ApiResponse<Array<GetAllRendering200ResponseOneOfInner>>>;
    /**
     * Retrieve custom text for a specific prompt and language.
     * Get custom text for a prompt
     *
     * @throws {RequiredError}
     */
    getCustomTextByLanguage(requestParameters: GetCustomTextByLanguageRequest, initOverrides?: InitOverride): Promise<ApiResponse<{
        [key: string]: any;
    }>>;
    /**
     * Get template partials for a prompt
     * Get partials for a prompt
     *
     * @throws {RequiredError}
     */
    getPartials(requestParameters: GetPartialsRequest, initOverrides?: InitOverride): Promise<ApiResponse<{
        [key: string]: any;
    }>>;
    /**
     * Retrieve details of the Universal Login configuration of your tenant. This includes the <a href="https://auth0.com/docs/authenticate/login/auth0-universal-login/identifier-first">Identifier First Authentication</a> and <a href="https://auth0.com/docs/secure/multi-factor-authentication/fido-authentication-with-webauthn/configure-webauthn-device-biometrics-for-mfa">WebAuthn with Device Biometrics for MFA</a> features.
     * Get prompt settings
     *
     * @throws {RequiredError}
     */
    get(initOverrides?: InitOverride): Promise<ApiResponse<PromptsSettings>>;
    /**
     * Get render settings for a screen.
     * Get render settings for a screen
     *
     * @throws {RequiredError}
     */
    getRendering(requestParameters: GetRenderingRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetRendering200Response>>;
    /**
     * Update the Universal Login configuration of your tenant. This includes the <a href="https://auth0.com/docs/authenticate/login/auth0-universal-login/identifier-first">Identifier First Authentication</a> and <a href="https://auth0.com/docs/secure/multi-factor-authentication/fido-authentication-with-webauthn/configure-webauthn-device-biometrics-for-mfa">WebAuthn with Device Biometrics for MFA</a> features.
     * Update prompt settings
     *
     * @throws {RequiredError}
     */
    update(bodyParameters: PromptsSettingsUpdate, initOverrides?: InitOverride): Promise<ApiResponse<PromptsSettings>>;
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
    updateRendering(requestParameters: PatchRenderingOperationRequest, bodyParameters: PatchRenderingRequest, initOverrides?: InitOverride): Promise<ApiResponse<PatchRendering200Response>>;
    /**
     * Set custom text for a specific prompt. Existing texts will be overwritten.
     * Set custom text for a specific prompt
     *
     * @throws {RequiredError}
     */
    updateCustomTextByLanguage(requestParameters: PutCustomTextByLanguageRequest, bodyParameters: {
        [key: string]: any;
    }, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Set template partials for a prompt
     * Set partials for a prompt
     *
     * @throws {RequiredError}
     */
    updatePartials(requestParameters: PutPartialsRequest, bodyParameters: {
        [key: string]: any;
    }, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
}
export {};
