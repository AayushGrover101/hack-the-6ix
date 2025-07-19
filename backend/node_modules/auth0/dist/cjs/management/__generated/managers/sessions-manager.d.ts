import * as runtime from '../../../lib/runtime.js';
import type { InitOverride, ApiResponse } from '../../../lib/runtime.js';
import type { GetSession200Response, DeleteSessionRequest, GetSessionRequest } from '../models/index.js';
declare const BaseAPI: typeof runtime.BaseAPI;
/**
 *
 */
export declare class SessionsManager extends BaseAPI {
    /**
     * Delete a session by ID.
     * Delete session
     *
     * @throws {RequiredError}
     */
    delete(requestParameters: DeleteSessionRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Retrieve session information.
     * Get session
     *
     * @throws {RequiredError}
     */
    get(requestParameters: GetSessionRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetSession200Response>>;
}
export {};
