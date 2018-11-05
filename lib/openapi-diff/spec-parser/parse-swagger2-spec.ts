import {ParsedSpec} from '../spec-parser-types';
import {Swagger2} from '../swagger2';
import {parseXPropertiesInObject} from './common/parse-x-properties';
import {PathBuilder} from './common/path-builder';
import {parseSwagger2Paths} from './swagger2/parse-swagger2-paths';

export const parseSwagger2Spec = (spec: Swagger2): ParsedSpec => {
    const pathBuilder = PathBuilder.createRootPathBuilder();
    return {
        format: 'swagger2',
        paths: parseSwagger2Paths(spec.paths, pathBuilder.withChild('paths'), spec),
        xProperties: parseXPropertiesInObject(spec, pathBuilder)
    };
};
