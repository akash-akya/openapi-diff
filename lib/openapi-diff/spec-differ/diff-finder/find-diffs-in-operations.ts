import {ParsedOperations} from '../../spec-parser-types';
import {getAddedKeysFromObjects} from './common/get-added-keys-from-objects';
import {getRemovedKeysFromObjects} from './common/get-removed-keys-from-objects';
import {createDifference} from './create-difference';
import {Difference} from './difference';

const findAddedMethodDifferences = (
    sourceOperations: ParsedOperations, destinationOperations: ParsedOperations
): Difference[] => {
    return getAddedKeysFromObjects(sourceOperations, destinationOperations)
        .map((addedMethod) => {
            const addedDestinationOperation = destinationOperations[addedMethod];
            return createDifference({
                action: 'add',
                destinationObject: addedDestinationOperation.originalValue,
                propertyName: 'method'
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
                propertyName: 'method',
                sourceObject: removedSourceOperation.originalValue
            });
        });
};
export const findDifferencesInOperations = (
    sourceOperations: ParsedOperations, destinationOperations: ParsedOperations
): Difference[] => {
    return [
        ...findAddedMethodDifferences(sourceOperations, destinationOperations),
        ...findRemovedMethodDifferences(sourceOperations, destinationOperations)
    ];
};
