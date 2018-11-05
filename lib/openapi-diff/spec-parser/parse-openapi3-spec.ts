import {OpenApi3} from '../openapi3';
import {ParsedSpec} from '../spec-parser-types';
import {parseXPropertiesInObject} from './common/parse-x-properties';
import {PathBuilder} from './common/path-builder';
import {parseOpenApi3Paths} from './openapi3/parse-openapi3-paths';

export const parseOpenApi3Spec = (spec: OpenApi3): ParsedSpec => {
    const pathBuilder = PathBuilder.createRootPathBuilder();

    return {
        format: 'openapi3',
        paths: parseOpenApi3Paths(spec.paths, pathBuilder.withChild('paths'), spec),
        xProperties: parseXPropertiesInObject(spec, pathBuilder)
    };
};
