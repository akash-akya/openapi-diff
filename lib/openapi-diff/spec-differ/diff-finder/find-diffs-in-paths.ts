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
                destinationSpecOrigins: [addedDestinationPathItem.originalValue],
                propertyName: 'path',
                source: 'openapi-diff',
                sourceSpecOrigins: []
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
                destinationSpecOrigins: [],
                propertyName: 'path',
                source: 'openapi-diff',
                sourceSpecOrigins: [removedSourcePathItem.originalValue]
            });
        });
};

const findDifferencesInMatchingPaths = async (
    sourcePathItems: ParsedPathItems, destinationPathItems: ParsedPathItems
): Promise<Difference[]> => {
    const matchingPaths = getCommonKeysFromObjects(sourcePathItems, destinationPathItems);

    const whenFindDifferencesInAllOperations = matchingPaths.map((matchingPathItem) =>
        findDifferencesInOperations(
            sourcePathItems[matchingPathItem].operations,
            destinationPathItems[matchingPathItem].operations));

    const differencesByOperation = await Promise.all(whenFindDifferencesInAllOperations);

    const flattenDifferences = differencesByOperation.reduce<Difference[]>((allDifferences, operationDifferences) =>
        [...allDifferences, ...operationDifferences], []);

    return flattenDifferences;
};

const normalizePathItems = (parsedPathItems: ParsedPathItems): ParsedPathItems =>
    Object.keys(parsedPathItems).reduce<ParsedPathItems>((normalizedParsedPathItems, pathName) => {
        const parsedPathItem = parsedPathItems[pathName];
        const normalizedPathName = normalizePath(pathName);
        normalizedParsedPathItems[normalizedPathName] = parsedPathItem;
        return normalizedParsedPathItems;
    }, {});

export const findDiffsInPaths = async (
    sourcePathItems: ParsedPathItems, destinationPathItems: ParsedPathItems
): Promise<Difference[]> => {
    const normalizedSourcePathItems = normalizePathItems(sourcePathItems);
    const normalizedDestinationPathItems = normalizePathItems(destinationPathItems);

    const addedPaths = findAddedPathDifferences(normalizedSourcePathItems, normalizedDestinationPathItems);
    const removedPaths = findRemovedPathDifferences(normalizedSourcePathItems, normalizedDestinationPathItems);
    const matchingPaths
        = await findDifferencesInMatchingPaths(normalizedSourcePathItems, normalizedDestinationPathItems);

    return [...addedPaths, ...removedPaths, ...matchingPaths];
};
