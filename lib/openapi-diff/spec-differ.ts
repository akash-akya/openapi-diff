import * as _ from 'lodash';
import {
    ValidationResult, ValidationResultAction, ValidationResultEntity,
    ValidationResultSpecEntityDetails
} from '../api-types';
import {resultTypeFinder} from './result-type-finder';
import {
    ParsedProperty,
    ParsedSpec
} from './types';

interface CreateValidationResultOptions<T> {
    sourceObject?: T;
    destinationObject?: T;
    propertyName: string;
    action: ValidationResultAction;
}

const findEntityForDiff = (propertyName: string): ValidationResultEntity => {
    return propertyName.includes('xProperties') ? 'oad.unclassified' : `oad.${propertyName}` as ValidationResultEntity;
};

const createValidationResult = <T>(options: CreateValidationResultOptions<ParsedProperty<T>>): ValidationResult => {
    const entity = findEntityForDiff(options.propertyName);
    return {
        action: options.action,
        destinationSpecEntityDetails: createSpecEntityDetails(options.destinationObject),
        entity,
        source: 'openapi-diff',
        sourceSpecEntityDetails: createSpecEntityDetails(options.sourceObject),
        type: resultTypeFinder.lookup(entity, options.action)
    };
};

const createSpecEntityDetails = <T>(parsedProperty?: ParsedProperty<T>): ValidationResultSpecEntityDetails => {
    return parsedProperty
        ? {
            location: parsedProperty.originalPath.join('.'),
            pathMethod: null,
            pathName: null,
            value: parsedProperty.value
          }
        : {
            location: undefined,
            pathMethod: null,
            pathName: null,
            value: undefined
        };
};

const isDefined = (target: any): boolean => {
    return !_.isUndefined(target);
};

const isDefinedDeep = (objectWithValue: { value?: any }): boolean => {
    return isDefined(objectWithValue) && isDefined(objectWithValue.value);
};

const isUndefinedDeep = (objectWithValue: { value?: any }): boolean => {
    return _.isUndefined(objectWithValue) || _.isUndefined(objectWithValue.value);
};

const findAdditionDiffsInProperty = <T>(sourceObject: ParsedProperty<T>,
                                        destinationObject: ParsedProperty<T>,
                                        propertyName: string): ValidationResult[] => {
    const isAddition = isUndefinedDeep(sourceObject) && isDefinedDeep(destinationObject);

    if (isAddition) {
        return [createValidationResult({sourceObject, destinationObject, propertyName, action: 'add'})];
    }

    return [];
};

const findDeletionDiffsInProperty = <T>(sourceObject: ParsedProperty<T>,
                                        destinationObject: ParsedProperty<T>,
                                        propertyName: string): ValidationResult[] => {
    const isDeletion = isDefinedDeep(sourceObject) && isUndefinedDeep(destinationObject);

    if (isDeletion) {
        return [createValidationResult({sourceObject, destinationObject, propertyName, action: 'delete'})];
    }

    return [];
};

const findEditionDiffsInProperty = (sourceObject: ParsedProperty<string>,
                                    destinationObject: ParsedProperty<string>,
                                    propertyName: string): ValidationResult[] => {
    const isEdition = isDefinedDeep(sourceObject)
        && isDefinedDeep(destinationObject) && (sourceObject.value !== destinationObject.value);

    if (isEdition) {
        return [createValidationResult({sourceObject, destinationObject, propertyName, action: 'edit'})];
    }

    return [];
};

const findDiffsInProperty = (sourceObject: ParsedProperty<string>,
                             destinationObject: ParsedProperty<string>,
                             propertyName: string): ValidationResult[] => {

    const additionDiffs = findAdditionDiffsInProperty(sourceObject, destinationObject, propertyName);
    const deletionDiffs = findDeletionDiffsInProperty(sourceObject, destinationObject, propertyName);
    const editionDiffs = findEditionDiffsInProperty(sourceObject, destinationObject, propertyName);

    return _.concat<ValidationResult>([], additionDiffs, deletionDiffs, editionDiffs);
};

const isValueInArray = (object: any, array?: any[]): boolean => {
    return _.some(array, {value: object.value});
};

const findAdditionDiffsInArray = <T>(sourceArrayContent: Array<ParsedProperty<T>> | undefined,
                                     destinationArrayContent: Array<ParsedProperty<T>> | undefined,
                                     arrayName: string): ValidationResult[] => {

    const arrayContentAdditionDiffs = _(destinationArrayContent)
        .filter((entry) => {
            return !isValueInArray(entry, sourceArrayContent);
        })
        .map((addedEntry) => {
            return createValidationResult({
                action: 'item.add',
                destinationObject: addedEntry,
                propertyName: arrayName,
                sourceObject: undefined
            });
        })
        .flatten<ValidationResult>()
        .value();

    return arrayContentAdditionDiffs;
};

const findDeletionDiffsInArray = <T>(sourceArrayContent: Array<ParsedProperty<T>> | undefined,
                                     destinationArrayContent: Array<ParsedProperty<T>> | undefined,
                                     arrayName: string): ValidationResult[] => {

    const arrayContentDeletionDiffs = _(sourceArrayContent)
        .filter((entry) => {
            return !isValueInArray(entry, destinationArrayContent);
        })
        .map((deletedEntry) => {
            return createValidationResult({
                action: 'item.delete',
                destinationObject: undefined,
                propertyName: arrayName,
                sourceObject: deletedEntry
            });
        })
        .flatten<ValidationResult>()
        .value();

    return arrayContentDeletionDiffs;
};

const findDiffsInArray = <T>(sourceArray: ParsedProperty<Array<ParsedProperty<T>>>,
                             destinationArray: ParsedProperty<Array<ParsedProperty<T>>>,
                             objectName: string): ValidationResult[] => {

    const arrayAdditionDiffs = findAdditionDiffsInProperty(sourceArray, destinationArray, objectName);
    const arrayDeletionDiffs = findDeletionDiffsInProperty(sourceArray, destinationArray, objectName);

    let arrayContentAdditionDiffs: ValidationResult[] = [];

    if (!arrayAdditionDiffs.length) {
        const sourceArrayContent = sourceArray.value;
        const destinationArrayContent = destinationArray.value;

        arrayContentAdditionDiffs = findAdditionDiffsInArray(sourceArrayContent, destinationArrayContent, objectName);
    }

    let arrayContentDeletionDiffs: ValidationResult[] = [];

    if (!arrayDeletionDiffs.length) {
        const sourceArrayContent = sourceArray.value;
        const destinationArrayContent = destinationArray.value;

        arrayContentDeletionDiffs = findDeletionDiffsInArray(sourceArrayContent, destinationArrayContent, objectName);
    }

    return _.concat<ValidationResult>([],
        arrayAdditionDiffs,
        arrayDeletionDiffs,
        arrayContentAdditionDiffs,
        arrayContentDeletionDiffs);
};

const findDiffsInXProperties = (sourceParsedXProperties: { [name: string]: ParsedProperty<any> },
                                destinationParsedXProperties: { [name: string]: ParsedProperty<any> },
                                xPropertyContainerName: string): ValidationResult[] => {

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
        .flatten<ValidationResult>()
        .value();

    return xPropertyDiffs;
};

const findDiffsInSpecs = (parsedSourceSpec: ParsedSpec, parsedDestinationSpec: ParsedSpec): ValidationResult[] => {

    const infoDiffs = _.concat([],
        findDiffsInProperty(parsedSourceSpec.info.termsOfService,
            parsedDestinationSpec.info.termsOfService, 'info.termsOfService'),
        findDiffsInProperty(parsedSourceSpec.info.description,
            parsedDestinationSpec.info.description, 'info.description'),
        findDiffsInProperty(parsedSourceSpec.info.contact.name,
            parsedDestinationSpec.info.contact.name, 'info.contact.name'),
        findDiffsInProperty(parsedSourceSpec.info.contact.email,
            parsedDestinationSpec.info.contact.email, 'info.contact.email'),
        findDiffsInProperty(parsedSourceSpec.info.contact.url,
            parsedDestinationSpec.info.contact.url, 'info.contact.url'),
        findDiffsInProperty(parsedSourceSpec.info.license.name,
            parsedDestinationSpec.info.license.name, 'info.license.name'),
        findDiffsInProperty(parsedSourceSpec.info.license.url,
            parsedDestinationSpec.info.license.url, 'info.license.url'),
        findDiffsInProperty(parsedSourceSpec.info.title,
            parsedDestinationSpec.info.title, 'info.title'),
        findDiffsInProperty(parsedSourceSpec.info.version,
            parsedDestinationSpec.info.version, 'info.version'),
        findDiffsInXProperties(parsedSourceSpec.info.xProperties,
            parsedDestinationSpec.info.xProperties, 'info.xProperties')
    );

    const basePathDiffs = findDiffsInProperty(parsedSourceSpec.basePath, parsedDestinationSpec.basePath, 'basePath');
    const hostDiffs = findDiffsInProperty(parsedSourceSpec.host, parsedDestinationSpec.host, 'host');
    const openApiDiffs = findDiffsInProperty(parsedSourceSpec.openapi, parsedDestinationSpec.openapi, 'openapi');
    const schemesDiffs = findDiffsInArray(parsedSourceSpec.schemes, parsedDestinationSpec.schemes, 'schemes');

    const topLevelXPropertyDiffs = findDiffsInXProperties(parsedSourceSpec.xProperties,
        parsedDestinationSpec.xProperties, 'xProperties');

    return _.concat([], infoDiffs, basePathDiffs, hostDiffs, openApiDiffs, schemesDiffs, topLevelXPropertyDiffs);
};

export const specDiffer = {
    diff: (parsedSourceSpec: ParsedSpec, parsedDestinationSpec: ParsedSpec): ValidationResult[] =>
        findDiffsInSpecs(parsedSourceSpec, parsedDestinationSpec)
};
