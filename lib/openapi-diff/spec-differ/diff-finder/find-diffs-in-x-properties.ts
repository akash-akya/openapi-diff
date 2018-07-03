import * as _ from 'lodash';
import {ParsedProperty} from '../../spec-parser-types';
import {createDifference} from './create-difference';
import {Difference} from './difference';

const findDiffsInProperty = (
    sourceObject: ParsedProperty<string>, destinationObject: ParsedProperty<string>, propertyName: string
): Difference[] => {

    const additionDiffs = findAdditionDiffsInProperty(sourceObject, destinationObject, propertyName);
    const deletionDiffs = findDeletionDiffsInProperty(sourceObject, destinationObject, propertyName);
    const editionDiffs = findEditionDiffsInProperty(sourceObject, destinationObject, propertyName);

    return _.concat<Difference>([], additionDiffs, deletionDiffs, editionDiffs);
};

const findAdditionDiffsInProperty = <T>(
    sourceObject: ParsedProperty<T>, destinationObject: ParsedProperty<T>, propertyName: string
): Difference[] => {
    const isAddition = isUndefinedDeep(sourceObject) && isDefinedDeep(destinationObject);

    if (isAddition) {
        return [createDifference({sourceObject, destinationObject, propertyName, action: 'add'})];
    }

    return [];
};

const findDeletionDiffsInProperty = <T>(
    sourceObject: ParsedProperty<T>, destinationObject: ParsedProperty<T>, propertyName: string
): Difference[] => {
    const isDeletion = isDefinedDeep(sourceObject) && isUndefinedDeep(destinationObject);

    if (isDeletion) {
        return [createDifference({sourceObject, destinationObject, propertyName, action: 'remove'})];
    }

    return [];
};

const findEditionDiffsInProperty = (
    sourceObject: ParsedProperty<string>, destinationObject: ParsedProperty<string>, propertyName: string
): Difference[] => {
    const isEdition = isDefinedDeep(sourceObject)
        && isDefinedDeep(destinationObject) && !_.isEqual(sourceObject.value, destinationObject.value);

    if (isEdition) {
        return [
            createDifference({sourceObject, destinationObject, propertyName, action: 'add'}),
            createDifference({sourceObject, destinationObject, propertyName, action: 'remove'})
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
    sourceParsedXProperties: { [name: string]: ParsedProperty<any> },
    destinationParsedXProperties: { [name: string]: ParsedProperty<any> },
    xPropertyContainerName: string): Difference[] => {

    const xPropertyUniqueNames = _(_.keys(sourceParsedXProperties))
        .concat(_.keys(destinationParsedXProperties))
        .uniq()
        .value();

    const xPropertyDiffs = _(xPropertyUniqueNames)
        .map((xPropertyName) => {
            return findDiffsInProperty(
                sourceParsedXProperties[xPropertyName],
                destinationParsedXProperties[xPropertyName],
                `${xPropertyContainerName}.${xPropertyName}`
            );
        })
        .flatten<Difference>()
        .value();

    return xPropertyDiffs;
};
