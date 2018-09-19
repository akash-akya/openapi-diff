import {
    ComponentsObject,
    ContentObject,
    OpenAPIObject,
    OperationObject,
    PathItemObject,
    ReferenceObject,
    RequestBodyObject,
    ResponseObject,
    ResponsesObject
} from 'openapi3-ts';

export type OpenApi3 = OpenAPIObject;
export type OpenApi3Components = ComponentsObject;
export type OpenApi3Content = ContentObject;
export type OpenApi3Operation = OperationObject;
export type OpenApi3PathItem = PathItemObject;
export type OpenApi3Reference = ReferenceObject;
export type OpenApi3RequestBody = RequestBodyObject;
export type OpenApi3Responses = ResponsesObject;
export type OpenApi3Response = ResponseObject;

export type OpenApi3MethodName = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

export interface OpenApi3Paths {
    [pathName: string]: OpenApi3PathItem;
}

export interface OpenApi3RequestBodies {
    [request: string]: OpenApi3RequestBody;
}
