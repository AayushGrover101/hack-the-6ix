import * as runtime from '../../../lib/runtime.js';
import type { InitOverride, ApiResponse } from '../../../lib/runtime.js';
import type { PostSsoTicketRequest, SsProfile, SsProfileCreate, SsProfileUpdate, SsoAccessTicketResponse, GetSelfServiceProfiles200ResponseOneOf, DeleteSelfServiceProfilesByIdRequest, GetSelfServiceProfileCustomTextRequest, GetSelfServiceProfilesRequest, GetSelfServiceProfilesByIdRequest, PatchSelfServiceProfilesByIdRequest, PostRevokeRequest, PostSsoTicketOperationRequest, PutSelfServiceProfileCustomTextRequest } from '../models/index.js';
declare const BaseAPI: typeof runtime.BaseAPI;
/**
 *
 */
export declare class SelfServiceProfilesManager extends BaseAPI {
    /**
     * Deletes a self-service profile by Id.
     * Delete a self-service profile by Id
     *
     * @throws {RequiredError}
     */
    delete(requestParameters: DeleteSelfServiceProfilesByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Retrieves text customizations for a given self-service profile, language and Self Service SSO Flow page.
     *
     * Get custom text for a self-service profile
     *
     * @throws {RequiredError}
     */
    getCustomText(requestParameters: GetSelfServiceProfileCustomTextRequest, initOverrides?: InitOverride): Promise<ApiResponse<{
        [key: string]: any;
    }>>;
    /**
     * Retrieves self-service profiles. Currently only one profile can be created per tenant.
     * Get self-service profiles
     *
     * @throws {RequiredError}
     */
    getAll(requestParameters: GetSelfServiceProfilesRequest & {
        include_totals: true;
    }, initOverrides?: InitOverride): Promise<ApiResponse<GetSelfServiceProfiles200ResponseOneOf>>;
    getAll(requestParameters?: GetSelfServiceProfilesRequest, initOverrides?: InitOverride): Promise<ApiResponse<Array<SsProfile>>>;
    /**
     * Retrieves a self-service profile by Id.
     * Get a self-service profile by Id
     *
     * @throws {RequiredError}
     */
    get(requestParameters: GetSelfServiceProfilesByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<SsProfile>>;
    /**
     * Updates a self-service profile.
     * Update a self-service profile
     *
     * @throws {RequiredError}
     */
    update(requestParameters: PatchSelfServiceProfilesByIdRequest, bodyParameters: SsProfileUpdate, initOverrides?: InitOverride): Promise<ApiResponse<SsProfile>>;
    /**
     * Revokes an SSO access ticket and invalidates associated sessions. The ticket will no longer be accepted to initiate a Self-Service SSO session. If any users have already started a session through this ticket, their session will be terminated. Clients should expect a `202 Accepted` response upon successful processing, indicating that the request has been acknowledged and that the revocation is underway but may not be fully completed at the time of response. If the specified ticket does not exist, a `202 Accepted` response is also returned, signaling that no further action is required.
     * Clients should treat these `202` responses as an acknowledgment that the request has been accepted and is in progress, even if the ticket was not found.
     *
     * Revoke an SSO access ticket
     *
     * @throws {RequiredError}
     */
    revokeSsoTicket(requestParameters: PostRevokeRequest, initOverrides?: InitOverride): Promise<ApiResponse<any>>;
    /**
     * Creates a self-service profile. Currently only one profile can be created per tenant.
     * Create a self-service profile
     *
     * @throws {RequiredError}
     */
    create(bodyParameters: SsProfileCreate, initOverrides?: InitOverride): Promise<ApiResponse<SsProfile>>;
    /**
     * Creates an SSO access ticket to initiate the Self Service SSO Flow using a self-service profile.
     *
     * Create an SSO access ticket to initiate the Self Service SSO Flow
     *
     * @throws {RequiredError}
     */
    createSsoTicket(requestParameters: PostSsoTicketOperationRequest, bodyParameters: PostSsoTicketRequest, initOverrides?: InitOverride): Promise<ApiResponse<SsoAccessTicketResponse>>;
    /**
     * Updates text customizations for a given self-service profile, language and Self Service SSO Flow page.
     *
     * Set custom text for a self-service profile
     *
     * @throws {RequiredError}
     */
    updateCustomText(requestParameters: PutSelfServiceProfileCustomTextRequest, bodyParameters: {
        [key: string]: any;
    }, initOverrides?: InitOverride): Promise<ApiResponse<{
        [key: string]: any;
    }>>;
}
export {};
