import {ParsedPathItem, ParsedPathItems} from '../../spec-parser-types';
import {Swagger2PathItem, Swagger2Paths} from '../../swagger2';
import {PathBuilder} from '../common/path-builder';
import {parseSwagger2Operations} from './parse-swagger2-operations';

const parsePath = (pathName: string, path: Swagger2PathItem, pathBuilder: PathBuilder): ParsedPathItem => {
    return {
        operations: parseSwagger2Operations(path, pathBuilder),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: path
        },
        pathName
    };
};

export const parseSwagger2Paths = (paths: Swagger2Paths, pathBuilder: PathBuilder): ParsedPathItems =>
    Object.keys(paths).reduce<ParsedPathItems>((accumulator, pathName) => {
        const pathItemObject = paths[pathName];
        const originalPath = pathBuilder.withChild(pathName);

        accumulator[pathName] = parsePath(pathName, pathItemObject, originalPath);

        return accumulator;
    }, {});
