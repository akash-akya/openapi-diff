import * as _ from 'lodash';
import {ParsedProperty} from '../../spec-parser-types';
import {createDifference} from './create-difference';
import {Difference} from './difference';

const findDiffsInXProperty = (
    sourceObject: ParsedProperty, destinationObject: ParsedProperty, propertyName: string
): Difference[] => {

    const additionDiffs = findAdditionDiffsInXProperty(sourceObject, destinationObject, propertyName);
    const deletionDiffs = findDeletionDiffsInXProperty(sourceObject, destinationObject, propertyName);
    const editionDiffs = findEditionDiffsInXProperty(sourceObject, destinationObject, propertyName);

    return _.concat<Difference>([], additionDiffs, deletionDiffs, editionDiffs);
};

const findAdditionDiffsInXProperty = (
    sourceObject: ParsedProperty, destinationObject: ParsedProperty, propertyName: string
): Difference[] => {
    const isAddition = isUndefinedDeep(sourceObject) && isDefinedDeep(destinationObject);

    if (isAddition) {
        return [createDifference({
            action: 'add',
            destinationSpecOrigins: [destinationObject],
            propertyName,
            source: 'openapi-diff',
            sourceSpecOrigins: []
        })];
    }

    return [];
};

const findDeletionDiffsInXProperty = (
    sourceObject: ParsedProperty, destinationObject: ParsedProperty, propertyName: string
): Difference[] => {
    const isDeletion = isDefinedDeep(sourceObject) && isUndefinedDeep(destinationObject);

    if (isDeletion) {
        return [createDifference({
            action: 'remove',
            destinationSpecOrigins: [],
            propertyName,
            source: 'openapi-diff',
            sourceSpecOrigins: [sourceObject]
        })];
    }

    return [];
};

const findEditionDiffsInXProperty = (
    sourceObject: ParsedProperty, destinationObject: ParsedProperty, propertyName: string
): Difference[] => {
    const isEdition = isDefinedDeep(sourceObject)
        && isDefinedDeep(destinationObject) && !_.isEqual(sourceObject.value, destinationObject.value);

    if (isEdition) {
        return [
            createDifference({
                action: 'add',
                destinationSpecOrigins: [destinationObject],
                propertyName,
                source: 'openapi-diff',
                sourceSpecOrigins: [sourceObject]
            }),
            createDifference({
                action: 'remove',
                destinationSpecOrigins: [destinationObject],
                propertyName,
                source: 'openapi-diff',
                sourceSpecOrigins: [sourceObject]
            })
        ];
    }

    return [];
};

const isUndefinedDeep = (objectWithValue: { value?: any }): boolean => {
    return _.isUndefined(objectWithValue) || _.isUndefined(objectWithValue.value);
};

const isDefinedDeep = (objectWithValue: { value?: any }): boolean => {
    return isDefined(objectWithValue) && isDefined(objectWithValue.value);
};

const isDefined = (target: any): boolean => {
    return !_.isUndefined(target);
};

export const findDiffsInXProperties = (
    sourceParsedXProperties: { [name: string]: ParsedProperty },
    destinationParsedXProperties: { [name: string]: ParsedProperty },
    xPropertyContainerName: string): Difference[] => {

    const xPropertyUniqueNames = _(_.keys(sourceParsedXProperties))
        .concat(_.keys(destinationParsedXProperties))
        .uniq()
        .value();

    const xPropertyDiffs = _(xPropertyUniqueNames)
        .map((xPropertyName) => {
            return findDiffsInXProperty(
                sourceParsedXProperties[xPropertyName],
                destinationParsedXProperties[xPropertyName],
                `${xPropertyContainerName}.${xPropertyName}`
            );
        })
        .flatten<Difference>()
        .value();

    return xPropertyDiffs;
};
