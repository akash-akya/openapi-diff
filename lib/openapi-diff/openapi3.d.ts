import {OpenAPIObject, PathItemObject} from 'openapi3-ts';

export type OpenApi3 = OpenAPIObject;

export interface OpenApi3Paths {
    [pathName: string]: PathItemObject;
}
