import {ParsedXProperties} from '../../types';

const isXProperty = (propertyPath: string): boolean => {
    return propertyPath.startsWith('x-');
};
export const parseXPropertiesInObject = (object: any): ParsedXProperties => {
    return Object.keys(object)
        .filter(isXProperty)
        .reduce<ParsedXProperties>((xProperties, currentKey) => {
            xProperties[currentKey] = {originalPath: [currentKey], value: object[currentKey]};
            return xProperties;
        }, {});
};
