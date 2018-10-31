import {OpenApi3} from '../../openapi3';
import {ParsedXProperties} from '../../spec-parser-types';
import {Swagger2} from '../../swagger2';
import {PathBuilder} from './path-builder';

const isXProperty = (propertyPath: string): boolean => {
    return propertyPath.startsWith('x-');
};
export const parseXPropertiesInObject = (object: Swagger2 | OpenApi3, pathBuilder: PathBuilder): ParsedXProperties => {
    return Object.keys(object)
        .filter(isXProperty)
        .reduce<ParsedXProperties>((xProperties, currentKey) => {
            xProperties[currentKey] = {
                originalPath: pathBuilder.withChild(currentKey).build(),
                value: object[currentKey]
            };
            return xProperties;
        }, {});
};
