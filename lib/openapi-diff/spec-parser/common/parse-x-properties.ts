import {ParsedXProperties} from '../../spec-parser-types';
import {PathBuilder} from './path-builder';

const isXProperty = (propertyPath: string): boolean => {
    return propertyPath.startsWith('x-');
};
export const parseXPropertiesInObject = (object: any, pathBuilder: PathBuilder): ParsedXProperties => {
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
