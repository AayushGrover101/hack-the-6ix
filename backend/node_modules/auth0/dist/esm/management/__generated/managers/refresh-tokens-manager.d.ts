import * as runtime from '../../../lib/runtime.js';
import type { InitOverride, ApiResponse } from '../../../lib/runtime.js';
import type { GetRefreshToken200Response, DeleteRefreshTokenRequest, GetRefreshTokenRequest } from '../models/index.js';
declare const BaseAPI: typeof runtime.BaseAPI;
/**
 *
 */
export declare class RefreshTokensManager extends BaseAPI {
    /**
     * Delete a refresh token by its ID.
     * Delete a refresh tokens
     *
     * @throws {RequiredError}
     */
    delete(requestParameters: DeleteRefreshTokenRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Retrieve refresh token information.
     * Get a refresh token
     *
     * @throws {RequiredError}
     */
    get(requestParameters: GetRefreshTokenRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetRefreshToken200Response>>;
}
export {};
