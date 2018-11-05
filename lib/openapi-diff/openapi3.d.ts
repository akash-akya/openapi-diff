import {
    ComponentsObject,
    HeaderObject,
    HeadersObject,
    MediaTypeObject,
    OpenAPIObject,
    OperationObject,
    PathItemObject, PathsObject,
    ReferenceObject,
    RequestBodyObject,
    ResponseObject,
    ResponsesObject,
    SchemaObject
} from 'openapi3-ts';

export interface ExtendedOpenApi3Schema extends OpenApi3Schema {
    components: {
        schemas?: {
            [schema: string]: OpenApi3Schema
        }
    };
}

export type OpenApi3 = OpenAPIObject;
export type OpenApi3Components = ComponentsObject;
export type OpenApi3MediaType = MediaTypeObject;
export type OpenApi3Operation = OperationObject;
export type OpenApi3PathItem = PathItemObject;
export type OpenApi3Paths = PathsObject;
export type OpenApi3Reference = ReferenceObject;
export type OpenApi3RequestBody = RequestBodyObject;
export type OpenApi3Responses = ResponsesObject;
export type OpenApi3Response = ResponseObject;
export type OpenApi3ResponseHeaders = HeadersObject;
export type OpenApi3ResponseHeader = HeaderObject;
export type OpenApi3Schema = SchemaObject;

export type OpenApi3MethodName = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

export interface OpenApi3RequestBodies {
    [request: string]: OpenApi3RequestBody | OpenApi3Reference;
}
