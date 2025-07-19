import * as runtime from '../../../lib/runtime.js';
import type { InitOverride, ApiResponse } from '../../../lib/runtime.js';
import type { GetFlowsExecutionsByExecutionId200Response, PatchFlowsByIdRequest, PatchFlowsVaultConnectionsByIdRequest, PostFlows201Response, PostFlowsRequest, PostFlowsVaultConnections201Response, PostFlowsVaultConnectionsRequest, GetFlows200ResponseOneOf, GetFlows200ResponseOneOfInner, GetFlowsExecutions200ResponseOneOf, GetFlowsExecutions200ResponseOneOfInner, GetFlowsVaultConnections200ResponseOneOf, GetFlowsVaultConnections200ResponseOneOfInner, DeleteFlowsByIdRequest, DeleteFlowsExecutionsByExecutionIdRequest, DeleteFlowsVaultConnectionsByIdRequest, GetFlowsRequest, GetFlowsByIdRequest, GetFlowsExecutionsRequest, GetFlowsExecutionsByExecutionIdRequest, GetFlowsVaultConnectionsRequest, GetFlowsVaultConnectionsByIdRequest, PatchFlowsByIdOperationRequest, PatchFlowsVaultConnectionsByIdOperationRequest } from '../models/index.js';
declare const BaseAPI: typeof runtime.BaseAPI;
/**
 *
 */
export declare class FlowsManager extends BaseAPI {
    /**
     * Delete a flow
     *
     * @throws {RequiredError}
     */
    delete(requestParameters: DeleteFlowsByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Delete a flow execution
     *
     * @throws {RequiredError}
     */
    deleteExecution(requestParameters: DeleteFlowsExecutionsByExecutionIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Delete a Flows Vault connection
     *
     * @throws {RequiredError}
     */
    deleteConnection(requestParameters: DeleteFlowsVaultConnectionsByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<void>>;
    /**
     * Get flows
     *
     * @throws {RequiredError}
     */
    getAll(requestParameters: GetFlowsRequest & {
        include_totals: true;
    }, initOverrides?: InitOverride): Promise<ApiResponse<GetFlows200ResponseOneOf>>;
    getAll(requestParameters?: GetFlowsRequest, initOverrides?: InitOverride): Promise<ApiResponse<Array<GetFlows200ResponseOneOfInner>>>;
    /**
     * Get a flow
     *
     * @throws {RequiredError}
     */
    get(requestParameters: GetFlowsByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostFlows201Response>>;
    /**
     * Get flow executions
     *
     * @throws {RequiredError}
     */
    getAllExecutions(requestParameters: GetFlowsExecutionsRequest & {
        include_totals: true;
    }, initOverrides?: InitOverride): Promise<ApiResponse<GetFlowsExecutions200ResponseOneOf>>;
    getAllExecutions(requestParameters?: GetFlowsExecutionsRequest, initOverrides?: InitOverride): Promise<ApiResponse<Array<GetFlowsExecutions200ResponseOneOfInner>>>;
    /**
     * Get a flow execution
     *
     * @throws {RequiredError}
     */
    getExecution(requestParameters: GetFlowsExecutionsByExecutionIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<GetFlowsExecutionsByExecutionId200Response>>;
    /**
     * Get Flows Vault connection list
     *
     * @throws {RequiredError}
     */
    getAllConnections(requestParameters: GetFlowsVaultConnectionsRequest & {
        include_totals: true;
    }, initOverrides?: InitOverride): Promise<ApiResponse<GetFlowsVaultConnections200ResponseOneOf>>;
    getAllConnections(requestParameters?: GetFlowsVaultConnectionsRequest, initOverrides?: InitOverride): Promise<ApiResponse<Array<GetFlowsVaultConnections200ResponseOneOfInner>>>;
    /**
     * Get a Flows Vault connection
     *
     * @throws {RequiredError}
     */
    getConnection(requestParameters: GetFlowsVaultConnectionsByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostFlowsVaultConnections201Response>>;
    /**
     * Update a flow
     *
     * @throws {RequiredError}
     */
    update(requestParameters: PatchFlowsByIdOperationRequest, bodyParameters: PatchFlowsByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostFlows201Response>>;
    /**
     * Update a Flows Vault connection
     *
     * @throws {RequiredError}
     */
    updateConnection(requestParameters: PatchFlowsVaultConnectionsByIdOperationRequest, bodyParameters: PatchFlowsVaultConnectionsByIdRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostFlowsVaultConnections201Response>>;
    /**
     * Create a flow
     *
     * @throws {RequiredError}
     */
    create(bodyParameters: PostFlowsRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostFlows201Response>>;
    /**
     * Create a Flows Vault connection
     *
     * @throws {RequiredError}
     */
    createConnection(bodyParameters: PostFlowsVaultConnectionsRequest, initOverrides?: InitOverride): Promise<ApiResponse<PostFlowsVaultConnections201Response>>;
}
export {};
