import * as _ from 'lodash';

import {ParsedSpec} from './types';

export default {
    findOriginalPath: (parsedSpec: ParsedSpec, parsedPath: string[]): string[] => {
        const parsedPathCopy = _.cloneDeep(parsedPath);

        if (_.last(parsedPathCopy) === 'parsedValue') {
            parsedPathCopy.pop();
        }

        const parsedPathString: string = parsedPathCopy.join('.');

        return _.has(parsedSpec, [parsedPathString, 'originalPath']) ?
               parsedSpec[parsedPathString].originalPath :
               parsedPath;
    },
    isOptionalProperty: (propertyPath: string): boolean => {
        const optionalPropertyNames: string[] = ['basePath', 'host', 'schemes'];
        return _.includes(optionalPropertyNames, propertyPath);
    },
    isXProperty: (propertyPath: string): boolean => {
        return propertyPath.startsWith('x-');
    }
};
