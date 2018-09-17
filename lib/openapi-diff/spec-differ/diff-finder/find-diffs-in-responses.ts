import {ParsedResponses} from '../../spec-parser-types';
import {getAddedKeysFromObjects} from './common/get-added-keys-from-objects';
import {getRemovedKeysFromObjects} from './common/get-removed-keys-from-objects';
import {createDifference} from './create-difference';
import {Difference} from './difference';

const findAddedDifferencesInResponses = (
    sourceResponses: ParsedResponses, destinationResponses: ParsedResponses
): Difference[] => {
    const addedResponses = getAddedKeysFromObjects(sourceResponses, destinationResponses);

    return addedResponses.map((statusCode) => {
        const parsedResponse = destinationResponses[statusCode];
        return createDifference({
            action: 'add',
            destinationSpecOrigins: [parsedResponse.originalValue],
            propertyName: 'response.status-code',
            source: 'openapi-diff',
            sourceSpecOrigins: []
        });
    });
};

const findRemovedDifferencesInResponses = (
    sourceResponses: ParsedResponses, destinationResponses: ParsedResponses
): Difference[] => {
    const removedResponses = getRemovedKeysFromObjects(sourceResponses, destinationResponses);

    return removedResponses.map((statusCode) => {
        const parsedResponse = sourceResponses[statusCode];
        return createDifference({
            action: 'remove',
            destinationSpecOrigins: [],
            propertyName: 'response.status-code',
            source: 'openapi-diff',
            sourceSpecOrigins: [parsedResponse.originalValue]
        });
    });
};

export const findDifferencesInResponses = (
    sourceResponses: ParsedResponses, destinationResponses: ParsedResponses
): Difference[] => {
    return [
        ...findAddedDifferencesInResponses(sourceResponses, destinationResponses),
        ...findRemovedDifferencesInResponses(sourceResponses, destinationResponses)
    ];
};
