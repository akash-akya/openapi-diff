import {ParsedSpec} from '../spec-parser-types';
import {Swagger2} from '../swagger2';
import {parseXPropertiesInObject} from './common/parse-x-properties';
import {PathBuilder} from './common/path-builder';
import {parseSwagger2Paths} from './swagger2/parse-swagger2-paths';

export const parseSwagger2Spec = (swagger2Spec: Swagger2): ParsedSpec => {
    const pathBuilder = PathBuilder.createRootPathBuilder();
    return {
        format: 'swagger2',
        paths: parseSwagger2Paths(swagger2Spec.paths, pathBuilder.withChild('paths')),
        xProperties: parseXPropertiesInObject(swagger2Spec, pathBuilder)
    };
};
