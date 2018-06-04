import * as _ from 'lodash';
import {
    DiffResult, DiffResultAction, DiffResultCode, DiffResultEntity,
    DiffResultSpecEntityDetails
} from '../api-types';
import {resultTypeFinder} from './spec-differ/result-type-finder';
import {
    ParsedProperty,
    ParsedSpec
} from './types';

interface CreateDiffResultOptions<T> {
    sourceObject?: T;
    destinationObject?: T;
    propertyName: string;
    action: DiffResultAction;
}

const findEntityForDiff = (propertyName: string): DiffResultEntity => {
    return propertyName.includes('xProperties') ? 'unclassified' : propertyName as DiffResultEntity;
};

const createDiffResult = <T>(options: CreateDiffResultOptions<ParsedProperty<T>>): DiffResult => {
    const entity = findEntityForDiff(options.propertyName);
    const code = `${entity}.${options.action}` as DiffResultCode;
    return {
        action: options.action,
        code,
        destinationSpecEntityDetails: createSpecEntityDetails(options.destinationObject),
        entity,
        source: 'openapi-diff',
        sourceSpecEntityDetails: createSpecEntityDetails(options.sourceObject),
        type: resultTypeFinder.lookup(code)
    };
};

const createSpecEntityDetails = <T>(parsedProperty?: ParsedProperty<T>): DiffResultSpecEntityDetails => {
    return parsedProperty
        ? {
            location: parsedProperty.originalPath.join('.'),
            value: parsedProperty.value
          }
        : {
            location: undefined,
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
                                        propertyName: string): DiffResult[] => {
    const isAddition = isUndefinedDeep(sourceObject) && isDefinedDeep(destinationObject);

    if (isAddition) {
        return [createDiffResult({sourceObject, destinationObject, propertyName, action: 'add'})];
    }

    return [];
};

const findDeletionDiffsInProperty = <T>(sourceObject: ParsedProperty<T>,
                                        destinationObject: ParsedProperty<T>,
                                        propertyName: string): DiffResult[] => {
    const isDeletion = isDefinedDeep(sourceObject) && isUndefinedDeep(destinationObject);

    if (isDeletion) {
        return [createDiffResult({sourceObject, destinationObject, propertyName, action: 'remove'})];
    }

    return [];
};

const findEditionDiffsInProperty = (sourceObject: ParsedProperty<string>,
                                    destinationObject: ParsedProperty<string>,
                                    propertyName: string): DiffResult[] => {
    const isEdition = isDefinedDeep(sourceObject)
        && isDefinedDeep(destinationObject) && (sourceObject.value !== destinationObject.value);

    if (isEdition) {
        return [
            createDiffResult({sourceObject, destinationObject, propertyName, action: 'add'}),
            createDiffResult({sourceObject, destinationObject, propertyName, action: 'remove'})
        ];
    }

    return [];
};

const findDiffsInProperty = (sourceObject: ParsedProperty<string>,
                             destinationObject: ParsedProperty<string>,
                             propertyName: string): DiffResult[] => {

    const additionDiffs = findAdditionDiffsInProperty(sourceObject, destinationObject, propertyName);
    const deletionDiffs = findDeletionDiffsInProperty(sourceObject, destinationObject, propertyName);
    const editionDiffs = findEditionDiffsInProperty(sourceObject, destinationObject, propertyName);

    return _.concat<DiffResult>([], additionDiffs, deletionDiffs, editionDiffs);
};

const isValueInArray = (object: any, array?: any[]): boolean => {
    return _.some(array, {value: object.value});
};

const findAdditionDiffsInArray = <T>(sourceArrayContent: Array<ParsedProperty<T>> | undefined,
                                     destinationArrayContent: Array<ParsedProperty<T>> | undefined,
                                     arrayName: string): DiffResult[] => {

    const arrayContentAdditionDiffs = _(destinationArrayContent)
        .filter((entry) => {
            return !isValueInArray(entry, sourceArrayContent);
        })
        .map((addedEntry) => {
            return createDiffResult({
                action: 'add',
                destinationObject: addedEntry,
                propertyName: `${arrayName}.item`,
                sourceObject: undefined
            });
        })
        .flatten<DiffResult>()
        .value();

    return arrayContentAdditionDiffs;
};

const findDeletionDiffsInArray = <T>(sourceArrayContent: Array<ParsedProperty<T>> | undefined,
                                     destinationArrayContent: Array<ParsedProperty<T>> | undefined,
                                     arrayName: string): DiffResult[] => {

    const arrayContentDeletionDiffs = _(sourceArrayContent)
        .filter((entry) => {
            return !isValueInArray(entry, destinationArrayContent);
        })
        .map((removedEntry) => {
            return createDiffResult({
                action: 'remove',
                destinationObject: undefined,
                propertyName: `${arrayName}.item`,
                sourceObject: removedEntry
            });
        })
        .flatten<DiffResult>()
        .value();

    return arrayContentDeletionDiffs;
};

const findDiffsInArray = <T>(sourceArray: ParsedProperty<Array<ParsedProperty<T>>>,
                             destinationArray: ParsedProperty<Array<ParsedProperty<T>>>,
                             objectName: string): DiffResult[] => {

    const arrayAdditionDiffs = findAdditionDiffsInProperty(sourceArray, destinationArray, objectName);
    const arrayDeletionDiffs = findDeletionDiffsInProperty(sourceArray, destinationArray, objectName);

    let arrayContentAdditionDiffs: DiffResult[] = [];

    if (!arrayAdditionDiffs.length) {
        const sourceArrayContent = sourceArray.value;
        const destinationArrayContent = destinationArray.value;

        arrayContentAdditionDiffs = findAdditionDiffsInArray(sourceArrayContent, destinationArrayContent, objectName);
    }

    let arrayContentDeletionDiffs: DiffResult[] = [];

    if (!arrayDeletionDiffs.length) {
        const sourceArrayContent = sourceArray.value;
        const destinationArrayContent = destinationArray.value;

        arrayContentDeletionDiffs = findDeletionDiffsInArray(sourceArrayContent, destinationArrayContent, objectName);
    }

    return _.concat<DiffResult>([],
        arrayAdditionDiffs,
        arrayDeletionDiffs,
        arrayContentAdditionDiffs,
        arrayContentDeletionDiffs);
};

const findDiffsInXProperties = (sourceParsedXProperties: { [name: string]: ParsedProperty<any> },
                                destinationParsedXProperties: { [name: string]: ParsedProperty<any> },
                                xPropertyContainerName: string): DiffResult[] => {

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
        .flatten<DiffResult>()
        .value();

    return xPropertyDiffs;
};

const findDiffsInSpecs = (
    parsedSourceSpec: ParsedSpec, parsedDestinationSpec: ParsedSpec
): Promise<DiffResult[]> => {

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

    return Promise.resolve(
        _.concat([], infoDiffs, basePathDiffs, hostDiffs, openApiDiffs, schemesDiffs, topLevelXPropertyDiffs)
    );
};

export const specFinder = {
    diff: findDiffsInSpecs
};
