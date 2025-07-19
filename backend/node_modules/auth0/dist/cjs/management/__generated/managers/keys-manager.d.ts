import * as runtime from '../../../lib/runtime.js';
import type { InitOverride, ApiResponse } from '../../../lib/runtime.js';
import type { GetEncryptionKeys200ResponseOneOfInner, GetSigningKeys200ResponseInner, PostEncryptionKeyRequest, PostEncryptionRequest, PostEncryptionWrappingKey201Response, PostSigningKeys201Response, PutSigningKeys200Response, GetEncryptionKeys200ResponseOneOf, DeleteEncryptionKeyRequest, GetEncryptionKeyRequest, GetEncryptionKeysRequest, GetSigningKeyRequest, PostEncryptionKeyOperationRequest, PostEncryptionWrappingKeyRequest, PutSigningKeysRequest } from '../models/index.js';
declare const BaseAPI: typeof runtime.BaseAPI;
/**
 *
 */
export declare class KeysManager extends BaseAPI {
    /**
     * Delete the custom provided encryption key with the given ID and move back to using native encryption key.
     * Delete the encryption key by its key id
     *
     * @throws {RequiredError}
     */
    deleteEncryptionKey(requestParameters: DeleteEncryptionKeyRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Retrieve details of the encryption key with the given ID.
     * Get the encryption key by its key id
     *
     * @throws {RequiredError}
     */
    getEncryptionKey(requestParameters: GetEncryptionKeyRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetEncryptionKeys200ResponseOneOfInner>>;
    /**
     * Retrieve details of all the encryption keys associated with your tenant.
     * Get all encryption keys
     *
     * @throws {RequiredError}
     */
    getAllEncryptionKeys(requestParameters: GetEncryptionKeysRequest & {
        include_totals: true;
    }, initOverrides?: InitOverride): Promise<ApiResponse<GetEncryptionKeys200ResponseOneOf>>;
    getAllEncryptionKeys(requestParameters?: GetEncryptionKeysRequest, initOverrides?: InitOverride): Promise<ApiResponse<Array<GetEncryptionKeys200ResponseOneOfInner>>>;
    /**
     * Get an Application Signing Key by its key id
     *
     * @throws {RequiredError}
     */
    get(requestParameters: GetSigningKeyRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetSigningKeys200ResponseInner>>;
    /**
     * Get all Application Signing Keys
     *
     * @throws {RequiredError}
     */
    getAll(initOverrides?: InitOverride): Promise<ApiResponse<Array<GetSigningKeys200ResponseInner>>>;
    /**
     * Create the new, pre-activated encryption key, without the key material.
     * Create the new encryption key
     *
     * @throws {RequiredError}
     */
    createEncryptionKey(bodyParameters: PostEncryptionRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetEncryptionKeys200ResponseOneOfInner>>;
    /**
     * Import wrapped key material and activate encryption key.
     * Import the encryption key
     *
     * @throws {RequiredError}
     */
    importEncryptionKey(requestParameters: PostEncryptionKeyOperationRequest, bodyParameters: PostEncryptionKeyRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetEncryptionKeys200ResponseOneOfInner>>;
    /**
     * Perform rekeying operation on the key hierarchy.
     * Rekey the key hierarchy
     *
     * @throws {RequiredError}
     */
    postEncryptionRekey(initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Create the public wrapping key to wrap your own encryption key material.
     * Create the public wrapping key
     *
     * @throws {RequiredError}
     */
    createPublicWrappingKey(requestParameters: PostEncryptionWrappingKeyRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostEncryptionWrappingKey201Response>>;
    /**
     * Rotate the Application Signing Key
     *
     * @throws {RequiredError}
     */
    rotate(initOverrides?: InitOverride): Promise<ApiResponse<PostSigningKeys201Response>>;
    /**
     * Revoke an Application Signing Key by its key id
     *
     * @throws {RequiredError}
     */
    revoke(requestParameters: PutSigningKeysRequest, initOverrides?: InitOverride): Promise<ApiResponse<PutSigningKeys200Response>>;
}
export {};
