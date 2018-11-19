import {ParsedResponses} from '../../spec-parser-types';
import {getAddedKeysFromObjects} from './common/get-added-keys-from-objects';
import {getCommonKeysFromObjects} from './common/get-common-keys-from-objects';
import {getRemovedKeysFromObjects} from './common/get-removed-keys-from-objects';
import {createDifference} from './create-difference';
import {Difference} from './difference';
import {findDifferencesInResponseBodies} from './find-diffs-in-response-bodies';
import {findDifferencesInResponseHeaders} from './find-diffs-in-response-headers';

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

const findDifferencesInMatchingResponses = async (
    sourceResponses: ParsedResponses, destinationResponses: ParsedResponses
): Promise<Difference[]> => {
    const whenDifferencesForAllMatchingResponses = getCommonKeysFromObjects(sourceResponses, destinationResponses)
        .map(async (matchingResponse) => {
            const matchingSourceResponse = sourceResponses[matchingResponse];
            const matchingDestinationResponse = destinationResponses[matchingResponse];

            const responseBodiesDifferences = await findDifferencesInResponseBodies(
                matchingSourceResponse,
                matchingDestinationResponse
            );

            const responseHeadersDifferences = findDifferencesInResponseHeaders(
                matchingSourceResponse.headers,
                matchingDestinationResponse.headers
            );

            return [...responseBodiesDifferences, ...responseHeadersDifferences];
        });

    const differencesByResponse = await Promise.all(whenDifferencesForAllMatchingResponses);

    return differencesByResponse
        .reduce<Difference[]>((allDifferences, responseDifferences) => [...allDifferences, ...responseDifferences], []);
};

export const findDifferencesInResponses = async (
    sourceResponses: ParsedResponses, destinationResponses: ParsedResponses
): Promise<Difference[]> => {
    const matchingResponsesDifferences
        = await findDifferencesInMatchingResponses(sourceResponses, destinationResponses);

    return [
        ...findAddedDifferencesInResponses(sourceResponses, destinationResponses),
        ...findRemovedDifferencesInResponses(sourceResponses, destinationResponses),
        ...matchingResponsesDifferences
    ];
};
