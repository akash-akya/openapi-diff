import * as _ from 'lodash';
import {Difference} from '../../../api-types';
import {ParsedPathItem} from '../../spec-parser-types';
import {createDifference} from './create-difference';
import {normalizePath} from './normalize-path';

const findAddedPathDifferences =  (
    sourcePathItems: ParsedPathItem[], destinationPathItems: ParsedPathItem[]
): Difference[] => {
    const sourcePathNames = getPathNames(sourcePathItems);

    return destinationPathItems
        .filter((pathItem) => !_.includes(sourcePathNames, pathItem.pathName))
        .map<Difference>((pathItem) =>
            createDifference({
                action: 'add',
                destinationObject: pathItem.originalValue,
                propertyName: 'path'
            })
        );
};

const findRemovedPathDifferences = (
    sourcePathItems: ParsedPathItem[], destinationPathItems: ParsedPathItem[]
): Difference[] => {
    const destinationPathNames = getPathNames(destinationPathItems);

    return sourcePathItems
        .filter((pathItem) => !_.includes(destinationPathNames, pathItem.pathName))
        .map<Difference>((pathItem) =>
            createDifference({
                action: 'remove',
                propertyName: 'path',
                sourceObject: pathItem.originalValue
            })
        );
};

const getPathNames = (pathItems: ParsedPathItem[]): string[] => pathItems.map((pathItem) => pathItem.pathName);

const normalizePathItems = (pathItems: ParsedPathItem[]): ParsedPathItem[] =>
    pathItems.map((pathItem) => (
        {...pathItem, pathName: normalizePath(pathItem.pathName)}
    ));

export const findDiffsInPaths = (
    sourcePathItems: ParsedPathItem[], destinationPathItems: ParsedPathItem[]
): Difference[] => {
    const normalisedSourcePathItems = normalizePathItems(sourcePathItems);
    const normalisedDestinationPathItems = normalizePathItems(destinationPathItems);

    const addedPaths = findAddedPathDifferences(normalisedSourcePathItems, normalisedDestinationPathItems);
    const removedPaths = findRemovedPathDifferences(normalisedSourcePathItems, normalisedDestinationPathItems);

    return [...addedPaths, ...removedPaths];
};
