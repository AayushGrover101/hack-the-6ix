import * as runtime from '../../../lib/runtime.js';
import type { InitOverride, ApiResponse } from '../../../lib/runtime.js';
import type { PatchFormsByIdRequest, PostForms201Response, PostFormsRequest, GetForms200ResponseOneOf, GetForms200ResponseOneOfInner, DeleteFormsByIdRequest, GetFormsRequest, GetFormsByIdRequest, PatchFormsByIdOperationRequest } from '../models/index.js';
declare const BaseAPI: typeof runtime.BaseAPI;
/**
 *
 */
export declare class FormsManager extends BaseAPI {
    /**
     * Delete a form
     *
     * @throws {RequiredError}
     */
    delete(requestParameters: DeleteFormsByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Get forms
     *
     * @throws {RequiredError}
     */
    getAll(requestParameters: GetFormsRequest & {
        include_totals: true;
    }, initOverrides?: InitOverride): Promise<ApiResponse<GetForms200ResponseOneOf>>;
    getAll(requestParameters?: GetFormsRequest, initOverrides?: InitOverride): Promise<ApiResponse<Array<GetForms200ResponseOneOfInner>>>;
    /**
     * Get a form
     *
     * @throws {RequiredError}
     */
    get(requestParameters: GetFormsByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostForms201Response>>;
    /**
     * Update a form
     *
     * @throws {RequiredError}
     */
    update(requestParameters: PatchFormsByIdOperationRequest, bodyParameters: PatchFormsByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostForms201Response>>;
    /**
     * Create a form
     *
     * @throws {RequiredError}
     */
    create(bodyParameters: PostFormsRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostForms201Response>>;
}
export {};
