// tslint:disable:no-implicit-dependencies
import {Operation, Path, Spec} from 'swagger-schema-official';

export type Swagger2 = Spec;
export type Swagger2PathItem = Path;
export type Swagger2Operation = Operation;

export type Swagger2MethodNames = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch';

export interface Swagger2Paths {
    [pathName: string]: Swagger2PathItem;
}
