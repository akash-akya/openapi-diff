import * as _ from 'lodash';
import * as VError from 'verror';
import {severityFinder} from './severity-finder';
import {
    DiffEntry,
    DiffEntrySeverity,
    DiffEntryTaxonomy,
    DiffEntryType,
    ParsedProperty,
    ParsedSpec
} from './types';

interface CreateDiffEntryOptions<T> {
    oldObject?: T;
    newObject?: T;
    propertyName: string;
    type: DiffEntryType;
}

const findPrintablePathForDiff = <T>(options: CreateDiffEntryOptions<ParsedProperty<T>>): string[] => {
    if (_.isUndefined(options.oldObject) && _.isUndefined(options.newObject)) {
        throw new VError(`ERROR: impossible to find the path for ${options.propertyName} - ${options.type}`);
    }
    return options.oldObject ?
        options.oldObject.originalPath :
        (options.newObject as ParsedProperty<T>).originalPath;
};

const findScopeForDiff = (propertyName: string): string => {
    return propertyName.includes('xProperties') ? 'unclassified' : propertyName;
};

const createDiffEntry = <T>(options: CreateDiffEntryOptions<ParsedProperty<T>>): DiffEntry => {
    const printablePath: string[] = findPrintablePathForDiff(options);
    const scope: string = findScopeForDiff(options.propertyName);
    const taxonomy: DiffEntryTaxonomy = `${scope}.${options.type}` as DiffEntryTaxonomy;
    const severity: DiffEntrySeverity = severityFinder.lookup(taxonomy);

    return {
        newValue: options.newObject ? options.newObject.value : undefined,
        oldValue: options.oldObject ? options.oldObject.value : undefined,
        printablePath,
        scope,
        severity,
        taxonomy,
        type: options.type
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

const findAdditionDiffsInProperty = <T>(oldObject: ParsedProperty<T>,
                                        newObject: ParsedProperty<T>,
                                        propertyName: string): DiffEntry[] => {
    const isAddition = isUndefinedDeep(oldObject) && isDefinedDeep(newObject);

    if (isAddition) {
        return [createDiffEntry({newObject, oldObject, propertyName, type: 'add'})];
    }

    return [];
};

const findDeletionDiffsInProperty = <T>(oldObject: ParsedProperty<T>,
                                        newObject: ParsedProperty<T>,
                                        propertyName: string): DiffEntry[] => {
    const isDeletion = isDefinedDeep(oldObject) && isUndefinedDeep(newObject);

    if (isDeletion) {
        return [createDiffEntry({newObject, oldObject, propertyName, type: 'delete'})];
    }

    return [];
};

const findEditionDiffsInProperty = (oldObject: ParsedProperty<string>,
                                    newObject: ParsedProperty<string>,
                                    propertyName: string): DiffEntry[] => {
    const isEdition = isDefinedDeep(oldObject) && isDefinedDeep(newObject) && (oldObject.value !== newObject.value);

    if (isEdition) {
        return [createDiffEntry({newObject, oldObject, propertyName, type: 'edit'})];
    }

    return [];
};

const findDiffsInProperty = (oldObject: ParsedProperty<string>,
                             newObject: ParsedProperty<string>,
                             propertyName: string): DiffEntry[] => {

    const additionDiffs: DiffEntry[] = findAdditionDiffsInProperty(oldObject, newObject, propertyName);
    const deletionDiffs: DiffEntry[] = findDeletionDiffsInProperty(oldObject, newObject, propertyName);
    const editionDiffs: DiffEntry[] = findEditionDiffsInProperty(oldObject, newObject, propertyName);

    return _.concat<DiffEntry>([], additionDiffs, deletionDiffs, editionDiffs);
};

const isValueInArray = (object: any, array?: any[]): boolean => {
    return _.some(array, {value: object.value});
};

const findAdditionDiffsInArray = <T>(oldArrayContent: Array<ParsedProperty<T>> | undefined,
                                     newArrayContent: Array<ParsedProperty<T>> | undefined,
                                     arrayName: string): DiffEntry[] => {

    const arrayContentAdditionDiffs = _(newArrayContent)
        .filter((entry) => {
            return !isValueInArray(entry, oldArrayContent);
        })
        .map((addedEntry) => {
            return createDiffEntry({
                newObject: addedEntry,
                oldObject: undefined,
                propertyName: arrayName,
                type: 'arrayContent.add'
            });
        })
        .flatten<DiffEntry>()
        .value();

    return arrayContentAdditionDiffs;
};

const findDeletionDiffsInArray = <T>(oldArrayContent: Array<ParsedProperty<T>> | undefined,
                                     newArrayContent: Array<ParsedProperty<T>> | undefined,
                                     arrayName: string): DiffEntry[] => {

    const arrayContentDeletionDiffs = _(oldArrayContent)
        .filter((entry) => {
            return !isValueInArray(entry, newArrayContent);
        })
        .map((deletedEntry) => {
            return createDiffEntry({
                newObject: undefined,
                oldObject: deletedEntry,
                propertyName: arrayName,
                type: 'arrayContent.delete'
            });
        })
        .flatten<DiffEntry>()
        .value();

    return arrayContentDeletionDiffs;
};

const findDiffsInArray = <T>(oldArray: ParsedProperty<Array<ParsedProperty<T>>>,
                             newArray: ParsedProperty<Array<ParsedProperty<T>>>,
                             objectName: string): DiffEntry[] => {

    const arrayAdditionDiffs: DiffEntry[] = findAdditionDiffsInProperty(oldArray, newArray, objectName);
    const arrayDeletionDiffs: DiffEntry[] = findDeletionDiffsInProperty(oldArray, newArray, objectName);

    let arrayContentAdditionDiffs: DiffEntry[] = [];

    if (!arrayAdditionDiffs.length) {
        const oldArrayContent = oldArray.value;
        const newArrayContent = newArray.value;

        arrayContentAdditionDiffs = findAdditionDiffsInArray(oldArrayContent, newArrayContent, objectName);
    }

    let arrayContentDeletionDiffs: DiffEntry[] = [];

    if (!arrayDeletionDiffs.length) {
        const oldArrayContent = oldArray.value;
        const newArrayContent = newArray.value;

        arrayContentDeletionDiffs = findDeletionDiffsInArray(oldArrayContent, newArrayContent, objectName);
    }

    return _.concat<DiffEntry>([],
        arrayAdditionDiffs,
        arrayDeletionDiffs,
        arrayContentAdditionDiffs,
        arrayContentDeletionDiffs);
};

const findDiffsInXProperties = (oldParsedXProperties: { [name: string]: ParsedProperty<any> },
                                newParsedXProperties: { [name: string]: ParsedProperty<any> },
                                xPropertyContainerName: string): DiffEntry[] => {

    const xPropertyUniqueNames = _(_.keys(oldParsedXProperties))
        .concat(_.keys(newParsedXProperties))
        .uniq()
        .value();

    const xPropertyDiffs = _(xPropertyUniqueNames)
        .map((xPropertyName) => {
            return findDiffsInProperty(
                oldParsedXProperties[xPropertyName],
                newParsedXProperties[xPropertyName],
                `${xPropertyContainerName}.${xPropertyName}`
            );
        })
        .flatten<DiffEntry>()
        .value();

    return xPropertyDiffs;
};

const findDiffsInSpecs = (oldParsedSpec: ParsedSpec, newParsedSpec: ParsedSpec): DiffEntry[] => {

    const infoDiffs = _.concat([],
        findDiffsInProperty(oldParsedSpec.info.termsOfService,
            newParsedSpec.info.termsOfService, 'info.termsOfService'),
        findDiffsInProperty(oldParsedSpec.info.description,
            newParsedSpec.info.description, 'info.description'),
        findDiffsInProperty(oldParsedSpec.info.contact.name,
            newParsedSpec.info.contact.name, 'info.contact.name'),
        findDiffsInProperty(oldParsedSpec.info.contact.email,
            newParsedSpec.info.contact.email, 'info.contact.email'),
        findDiffsInProperty(oldParsedSpec.info.contact.url,
            newParsedSpec.info.contact.url, 'info.contact.url'),
        findDiffsInProperty(oldParsedSpec.info.license.name,
            newParsedSpec.info.license.name, 'info.license.name'),
        findDiffsInProperty(oldParsedSpec.info.license.url,
            newParsedSpec.info.license.url, 'info.license.url'),
        findDiffsInProperty(oldParsedSpec.info.title,
            newParsedSpec.info.title, 'info.title'),
        findDiffsInProperty(oldParsedSpec.info.version,
            newParsedSpec.info.version, 'info.version'),
        findDiffsInXProperties(oldParsedSpec.info.xProperties,
            newParsedSpec.info.xProperties, 'info.xProperties')
    );

    const basePathDiffs = findDiffsInProperty(oldParsedSpec.basePath, newParsedSpec.basePath, 'basePath');
    const hostDiffs = findDiffsInProperty(oldParsedSpec.host, newParsedSpec.host, 'host');
    const openApiDiffs = findDiffsInProperty(oldParsedSpec.openapi, newParsedSpec.openapi, 'openapi');
    const schemesDiffs = findDiffsInArray(oldParsedSpec.schemes, newParsedSpec.schemes, 'schemes');

    const topLevelXPropertyDiffs = findDiffsInXProperties(oldParsedSpec.xProperties,
        newParsedSpec.xProperties, 'xProperties');

    return _.concat([], infoDiffs, basePathDiffs, hostDiffs, openApiDiffs, schemesDiffs, topLevelXPropertyDiffs);
};

export const specDiffer = {
    diff: (oldParsedSpec: ParsedSpec, newParsedSpec: ParsedSpec): DiffEntry[] => {
        return findDiffsInSpecs(oldParsedSpec, newParsedSpec);
    }
};
