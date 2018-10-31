import {OpenApi3PathItem, OpenApi3Paths} from '../../openapi3';
import {ParsedPathItem, ParsedPathItems} from '../../spec-parser-types';
import {PathBuilder} from '../common/path-builder';
import {parseOpenApi3Operations} from './parse-openapi3-operations';

const parsePath = (pathName: string, path: OpenApi3PathItem, pathBuilder: PathBuilder): ParsedPathItem => {
    return {
        operations: parseOpenApi3Operations(path, pathBuilder),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: path
        },
        pathName
    };
};

export const parseOpenApi3Paths = (paths: OpenApi3Paths, pathBuilder: PathBuilder): ParsedPathItems =>
    Object.keys(paths).reduce<ParsedPathItems>((accumulator, pathName) => {
        const pathItemObject = paths[pathName];
        const originalPath = pathBuilder.withChild(pathName);

        accumulator[pathName] = parsePath(pathName, pathItemObject, originalPath);

        return accumulator;
    }, {});
