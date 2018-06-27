// tslint:disable:no-implicit-dependencies
import {Path, Spec} from 'swagger-schema-official';

export type Swagger2 = Spec;
export type Swagger2PathItem = Path;

export interface Swagger2Paths {
    [pathName: string]: Swagger2PathItem;
}
