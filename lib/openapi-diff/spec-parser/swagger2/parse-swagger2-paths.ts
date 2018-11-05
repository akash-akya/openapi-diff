import {ParsedPathItem, ParsedPathItems} from '../../spec-parser-types';
import {Swagger2, Swagger2PathItem, Swagger2Paths} from '../../swagger2';
import {PathBuilder} from '../common/path-builder';
import {parseSwagger2Operations} from './parse-swagger2-operations';

const parsePath = (path: Swagger2PathItem, pathBuilder: PathBuilder, spec: Swagger2): ParsedPathItem => {
    return {
        operations: parseSwagger2Operations(path, pathBuilder, spec),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: path
        }
    };
};

export const parseSwagger2Paths = (paths: Swagger2Paths, pathBuilder: PathBuilder, spec: Swagger2): ParsedPathItems =>
    Object.keys(paths).reduce<ParsedPathItems>((accumulator, pathName) => {
        const pathItemObject = paths[pathName];
        const originalPath = pathBuilder.withChild(pathName);

        accumulator[pathName] = parsePath(pathItemObject, originalPath, spec);

        return accumulator;
    }, {});
