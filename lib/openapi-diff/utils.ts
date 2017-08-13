import * as _ from 'lodash';

import {ParsedSpec} from './types';

export default {
    findOriginalPath: (parsedSpec: ParsedSpec, parsedPath: string[]): string[] => {
        const parsedPathCopy = _.cloneDeep(parsedPath);

        if (_.last(parsedPathCopy) === 'value') {
            parsedPathCopy.pop();
        }

        const parsedPathString: string = parsedPathCopy.join('.');

        return _.has(parsedSpec, [parsedPathString, 'originalPath']) ?
               parsedSpec[parsedPathString].originalPath :
               parsedPath;
    },
    isXProperty: (propertyPath: string): boolean => {
        return propertyPath.startsWith('x-');
    }
};
