import {ParsedOperations} from '../../spec-parser-types';
import {getAddedKeysFromObjects} from './common/get-added-keys-from-objects';
import {getCommonKeysFromObjects} from './common/get-common-keys-from-objects';
import {getRemovedKeysFromObjects} from './common/get-removed-keys-from-objects';
import {createDifference} from './create-difference';
import {Difference} from './difference';
import {findDifferencesInRequestBodies} from './find-diffs-in-request-bodies';
import {findDifferencesInResponses} from './find-diffs-in-responses';

const findAddedMethodDifferences = (
    sourceOperations: ParsedOperations, destinationOperations: ParsedOperations
): Difference[] => {
    return getAddedKeysFromObjects(sourceOperations, destinationOperations)
        .map((addedMethod) => {
            const addedDestinationOperation = destinationOperations[addedMethod];
            return createDifference({
                action: 'add',
                destinationSpecOrigins: [addedDestinationOperation.originalValue],
                propertyName: 'method',
                source: 'openapi-diff',
                sourceSpecOrigins: []
            });
        });
};

const findRemovedMethodDifferences = (
    sourceOperations: ParsedOperations, destinationOperations: ParsedOperations
): Difference[] => {
    return getRemovedKeysFromObjects(sourceOperations, destinationOperations)
        .map((removedMethod) => {
            const removedSourceOperation = sourceOperations[removedMethod];
            return createDifference({
                action: 'remove',
                destinationSpecOrigins: [],
                propertyName: 'method',
                source: 'openapi-diff',
                sourceSpecOrigins: [removedSourceOperation.originalValue]
            });
        });
};

const findMatchingMethodsDifferences = async (
    sourceOperations: ParsedOperations, destinationOperations: ParsedOperations
): Promise<Difference[]> => {
    const whenDifferencesForAllMatchingMethods = getCommonKeysFromObjects(sourceOperations, destinationOperations)
        .map(async (matchingMethod) => {
            const matchingSourceOperation = sourceOperations[matchingMethod];
            const matchingDestinationOperation = destinationOperations[matchingMethod];

            const requestBodyDifferences = await findDifferencesInRequestBodies(
                matchingSourceOperation.requestBody,
                matchingDestinationOperation.requestBody
            );

            const responsesDifferences = findDifferencesInResponses(
                matchingSourceOperation.responses,
                matchingDestinationOperation.responses
            );

            return [
                ...requestBodyDifferences,
                ...responsesDifferences
            ];
        });

    const differencesByMethod = await Promise.all(whenDifferencesForAllMatchingMethods);
    return differencesByMethod
        .reduce<Difference[]>((allDifferences, methodDifferences) => [...allDifferences, ...methodDifferences], []);
};

export const findDifferencesInOperations = async (
    sourceOperations: ParsedOperations, destinationOperations: ParsedOperations
): Promise<Difference[]> => {
    const matchingMethodsDifferences = await findMatchingMethodsDifferences(sourceOperations, destinationOperations);
    return [
        ...findAddedMethodDifferences(sourceOperations, destinationOperations),
        ...findRemovedMethodDifferences(sourceOperations, destinationOperations),
        ...matchingMethodsDifferences
    ];
};
