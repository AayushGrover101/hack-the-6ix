import * as runtime from '../../../lib/runtime.js';
import type { InitOverride, ApiResponse } from '../../../lib/runtime.js';
import type { GetTokenExchangeProfiles200Response, GetTokenExchangeProfilesById200Response, PatchTokenExchangeProfilesByIdRequest, PostTokenExchangeProfilesRequest, DeleteTokenExchangeProfilesByIdRequest, GetTokenExchangeProfilesRequest, GetTokenExchangeProfilesByIdRequest, PatchTokenExchangeProfilesByIdOperationRequest } from '../models/index.js';
declare const BaseAPI: typeof runtime.BaseAPI;
/**
 *
 */
export declare class TokenExchangeProfilesManager extends BaseAPI {
    /**
     * Delete a Token Exchange Profile within your tenant.
     * Delete a token exchange profile
     *
     * @throws {RequiredError}
     */
    delete(requestParameters: DeleteTokenExchangeProfilesByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Retrieve a list of all Token Exchange Profiles available in your tenant.
     *
     * This endpoint supports Checkpoint pagination. To search by checkpoint, use the following parameters:
     * <ul>
     * <li><code>from</code>: Optional id from which to start selection.</li>
     * <li><code>take</code>: The total amount of entries to retrieve when using the from parameter. Defaults to 50.</li>
     * </ul>
     *
     * <b>Note</b>: The first time you call this endpoint using checkpoint pagination, omit the <code>from</code> parameter. If there are more results, a <code>next</code> value is included in the response. You can use this for subsequent API calls. When <code>next</code> is no longer included in the response, no pages are remaining.
     * Get token exchange profiles
     *
     * @throws {RequiredError}
     */
    getAll(requestParameters?: GetTokenExchangeProfilesRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetTokenExchangeProfiles200Response>>;
    /**
     * Retrieve details about a single Token Exchange Profile specified by ID.
     *
     * Get a token exchange profile
     *
     * @throws {RequiredError}
     */
    get(requestParameters: GetTokenExchangeProfilesByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetTokenExchangeProfilesById200Response>>;
    /**
     * Update a Token Exchange Profile within your tenant.
     *
     * Update an existing token exchange profile
     *
     * @throws {RequiredError}
     */
    update(requestParameters: PatchTokenExchangeProfilesByIdOperationRequest, bodyParameters: PatchTokenExchangeProfilesByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Create a new Token Exchange Profile within your tenant.
     *
     * Create a token exchange profile
     *
     * @throws {RequiredError}
     */
    create(bodyParameters: PostTokenExchangeProfilesRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetTokenExchangeProfilesById200Response>>;
}
export {};
