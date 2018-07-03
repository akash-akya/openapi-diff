import {ParsedPathItems} from '../../spec-parser-types';
import {getAddedKeysFromObjects} from './common/get-added-keys-from-objects';
import {getCommonKeysFromObjects} from './common/get-common-keys-from-objects';
import {getRemovedKeysFromObjects} from './common/get-removed-keys-from-objects';
import {createDifference} from './create-difference';
import {Difference} from './difference';
import {findDifferencesInOperations} from './find-diffs-in-operations';
import {normalizePath} from './normalize-path';

const findAddedPathDifferences = (
    sourcePathItems: ParsedPathItems, destinationPathItems: ParsedPathItems
): Difference[] => {
    return getAddedKeysFromObjects(sourcePathItems, destinationPathItems)
        .map((addedPathName) => {
            const addedDestinationPathItem = destinationPathItems[addedPathName];
            return createDifference({
                action: 'add',
                destinationObject: addedDestinationPathItem.originalValue,
                propertyName: 'path'
            });
        });
};

const findRemovedPathDifferences = (
    sourcePathItems: ParsedPathItems, destinationPathItems: ParsedPathItems
): Difference[] => {
    return getRemovedKeysFromObjects(sourcePathItems, destinationPathItems)
        .map<Difference>((removedPathName) => {
            const removedSourcePathItem = sourcePathItems[removedPathName];
            return createDifference({
                action: 'remove',
                propertyName: 'path',
                sourceObject: removedSourcePathItem.originalValue
            });
        });
};

const findMatchingPathDifferences = (
    sourcePathItems: ParsedPathItems, destinationPathItems: ParsedPathItems
): Difference[] => {
    const matchingPaths = getCommonKeysFromObjects(sourcePathItems, destinationPathItems);

    return matchingPaths.reduce<Difference[]>((allDifferences, matchingPathItem) => {
        const differencesInOperations = findDifferencesInOperations(
            sourcePathItems[matchingPathItem].operations,
            destinationPathItems[matchingPathItem].operations
        );
        return [...allDifferences, ...differencesInOperations];
    }, []);
};

const normalizePathItems = (parsedPathItems: ParsedPathItems): ParsedPathItems =>
    Object.keys(parsedPathItems).reduce<ParsedPathItems>((normalizedParsedPathItems, pathName) => {
        const parsedPathItem = parsedPathItems[pathName];
        const normalizedPathName = normalizePath(pathName);
        normalizedParsedPathItems[normalizedPathName] = {...parsedPathItem, pathName: normalizedPathName};
        return normalizedParsedPathItems;
    }, {});

export const findDiffsInPaths = (
    sourcePathItems: ParsedPathItems, destinationPathItems: ParsedPathItems
): Difference[] => {
    const normalizedSourcePathItems = normalizePathItems(sourcePathItems);
    const normalizedDestinationPathItems = normalizePathItems(destinationPathItems);

    const addedPaths = findAddedPathDifferences(normalizedSourcePathItems, normalizedDestinationPathItems);
    const removedPaths = findRemovedPathDifferences(normalizedSourcePathItems, normalizedDestinationPathItems);
    const matchingPaths = findMatchingPathDifferences(normalizedSourcePathItems, normalizedDestinationPathItems);

    return [...addedPaths, ...removedPaths, ...matchingPaths];
};
