import {OpenAPIObject, PathItemObject} from 'openapi3-ts';

export type OpenApi3 = OpenAPIObject;

export type OpenApi3MethodName = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

export interface OpenApi3Paths {
    [pathName: string]: PathItemObject;
}
