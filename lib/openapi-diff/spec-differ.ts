import * as _ from 'lodash';

import {
    DiffEntry,
    DiffEntrySeverity,
    DiffEntryTaxonomy,
    DiffEntryType,
    ParsedSpec,
    ParsedTopLevelProperty
} from './types';

interface CreateDiffEntityOptions {
    oldObject: any;
    newObject: any;
    propertyName: string;
    type: DiffEntryType;
    severity: DiffEntrySeverity;
}

const findScopeForDiff = (propertyName: string): string => {
    return propertyName.includes('xProperties') ? 'unclassified' : `${propertyName}.property`;
};

const createDiffEntity = (options: CreateDiffEntityOptions): DiffEntry => {
    const scope = findScopeForDiff(options.propertyName);

    return {
        newValue: options.newObject ? options.newObject.value : undefined,
        oldValue: options.oldObject ? options.oldObject.value : undefined,
        printablePath: options.oldObject ? options.oldObject.originalPath : options.newObject.originalPath,
        scope,
        severity: options.severity,
        taxonomy: `${scope}.${options.type}` as DiffEntryTaxonomy,
        type: options.type
    };
};

const isDefined = (target: any): boolean => {
    return !_.isUndefined(target);
};

const isDefinedDeep = (objectWithValue: { value: any }): boolean => {
    return isDefined(objectWithValue) && isDefined(objectWithValue.value);
};

const isUndefinedDeep = (objectWithValue: { value: any }): boolean => {
    return _.isUndefined(objectWithValue) || _.isUndefined(objectWithValue.value);
};

const findAdditionDiffsInProperty = (oldObject: any,
                                     newObject: any,
                                     propertyName: string,
                                     severity: DiffEntrySeverity): DiffEntry[] => {
    const isAddition = isUndefinedDeep(oldObject) && isDefinedDeep(newObject);

    if (isAddition) {
        return [createDiffEntity({newObject, oldObject, propertyName, severity, type: 'add'})];
    }

    return [];
};

const findDeletionDiffsInProperty = (oldObject: any,
                                     newObject: any,
                                     propertyName: string,
                                     severity: DiffEntrySeverity): DiffEntry[] => {
    const isDeletion = isDefinedDeep(oldObject) && isUndefinedDeep(newObject);

    if (isDeletion) {
        return [createDiffEntity({newObject, oldObject, propertyName, severity, type: 'delete'})];
    }

    return [];
};

const findEditionDiffsInProperty = (oldObject: any,
                                    newObject: any,
                                    propertyName: string,
                                    severity: DiffEntrySeverity): DiffEntry[] => {
    const isEdition = isDefinedDeep(oldObject) && isDefinedDeep(newObject) && (oldObject.value !== newObject.value);

    if (isEdition) {
        return [createDiffEntity({newObject, oldObject, propertyName, severity, type: 'edit'})];
    }

    return [];
};

const findDiffsInProperty = (oldObject: ParsedTopLevelProperty<string>,
                             newObject: ParsedTopLevelProperty<string>,
                             propertyName: string,
                             severity: DiffEntrySeverity): DiffEntry[] => {

    const additionDiffs: DiffEntry[] = findAdditionDiffsInProperty(oldObject, newObject, propertyName, severity);
    const deletionDiffs: DiffEntry[] = findDeletionDiffsInProperty(oldObject, newObject, propertyName, severity);
    const editionDiffs: DiffEntry[] = findEditionDiffsInProperty(oldObject, newObject, propertyName, severity);

    return _.concat<DiffEntry>([], additionDiffs, deletionDiffs, editionDiffs);
};

const isValueInArray = (object: any, array?: any[]): boolean => {
    return _.some(array, {value: object.value});
};

const findAdditionDiffsInArray = (oldArrayContent: any[] | undefined,
                                  newArrayContent: any[] | undefined,
                                  arrayName: string,
                                  severity: DiffEntrySeverity): DiffEntry[] => {

    const arrayContentAdditionDiffs: DiffEntry[] = [];

    if (newArrayContent) {
        for (const entry of newArrayContent) {
            if (!isValueInArray(entry, oldArrayContent)) {
                arrayContentAdditionDiffs
                    .push(createDiffEntity({
                        newObject: entry,
                        oldObject: undefined,
                        propertyName: arrayName,
                        severity,
                        type: 'arrayContent.add'
                    }));
            }
        }
    }

    return arrayContentAdditionDiffs;
};

const findDeletionDiffsInArray = (oldArrayContent: any[] | undefined,
                                  newArrayContent: any[] | undefined,
                                  arrayName: string,
                                  severity: DiffEntrySeverity): DiffEntry[] => {

    const arrayContentDeletionDiffs: DiffEntry[] = [];

    if (oldArrayContent) {
        for (const entry of oldArrayContent) {
            if (!isValueInArray(entry, newArrayContent)) {
                arrayContentDeletionDiffs
                    .push(createDiffEntity({
                        newObject: undefined,
                        oldObject: entry,
                        propertyName: arrayName,
                        severity,
                        type: 'arrayContent.delete'
                    }));
            }
        }
    }

    return arrayContentDeletionDiffs;
};

const findDiffsInArray = <T>(oldArray: ParsedTopLevelProperty<Array<ParsedTopLevelProperty<T>>>,
                             newArray: ParsedTopLevelProperty<Array<ParsedTopLevelProperty<T>>>,
                             objectName: string): DiffEntry[] => {

    const arrayAdditionDiffs: DiffEntry[] = findAdditionDiffsInProperty(oldArray, newArray, objectName, 'breaking');
    const arrayDeletionDiffs: DiffEntry[] = findDeletionDiffsInProperty(oldArray, newArray, objectName, 'breaking');

    let arrayContentAdditionDiffs: DiffEntry[] = [];

    if (!arrayAdditionDiffs.length) {
        const oldArrayContent = oldArray.value;
        const newArrayContent = newArray.value;

        arrayContentAdditionDiffs = findAdditionDiffsInArray(oldArrayContent,
            newArrayContent,
            objectName,
            'non-breaking');
    }

    let arrayContentDeletionDiffs: DiffEntry[] = [];

    if (!arrayDeletionDiffs.length) {
        const oldArrayContent = oldArray.value;
        const newArrayContent = newArray.value;

        arrayContentDeletionDiffs = findDeletionDiffsInArray(oldArrayContent,
            newArrayContent,
            objectName,
            'breaking');
    }

    return _.concat<DiffEntry>([],
        arrayAdditionDiffs,
        arrayDeletionDiffs,
        arrayContentAdditionDiffs,
        arrayContentDeletionDiffs);
};

const findDiffsInXProperties = (oldParsedXProperties: { [name: string]: ParsedTopLevelProperty<any> },
                                newParsedXProperties: { [name: string]: ParsedTopLevelProperty<any> },
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
                `${xPropertyContainerName}.${xPropertyName}`,
                'unclassified'
            );
        })
        .flatten<DiffEntry>()
        .value();

    return xPropertyDiffs;
};

const findDiffsInSpecs = (oldParsedSpec: ParsedSpec, newParsedSpec: ParsedSpec): DiffEntry[] => {

    const infoDiffs = _.concat([],
        findDiffsInProperty(oldParsedSpec.info.termsOfService,
            newParsedSpec.info.termsOfService, 'info.termsOfService', 'non-breaking'),
        findDiffsInProperty(oldParsedSpec.info.description,
            newParsedSpec.info.description, 'info.description', 'non-breaking'),
        findDiffsInProperty(oldParsedSpec.info.contact.name,
            newParsedSpec.info.contact.name, 'info.contact.name', 'non-breaking'),
        findDiffsInProperty(oldParsedSpec.info.contact.email,
            newParsedSpec.info.contact.email, 'info.contact.email', 'non-breaking'),
        findDiffsInProperty(oldParsedSpec.info.contact.url,
            newParsedSpec.info.contact.url, 'info.contact.url', 'non-breaking'),
        findDiffsInProperty(oldParsedSpec.info.license.name,
            newParsedSpec.info.license.name, 'info.license.name', 'non-breaking'),
        findDiffsInProperty(oldParsedSpec.info.license.url,
            newParsedSpec.info.license.url, 'info.license.url', 'non-breaking'),
        findDiffsInProperty(oldParsedSpec.info.title,
            newParsedSpec.info.title, 'info.title', 'non-breaking'),
        findDiffsInProperty(oldParsedSpec.info.version,
            newParsedSpec.info.version, 'info.version', 'non-breaking'),
        findDiffsInXProperties(oldParsedSpec.info.xProperties,
            newParsedSpec.info.xProperties, 'info.xProperties')
    );

    const basePathDiffs = findDiffsInProperty(oldParsedSpec.basePath, newParsedSpec.basePath, 'basePath', 'breaking');
    const hostDiffs = findDiffsInProperty(oldParsedSpec.host, newParsedSpec.host, 'host', 'breaking');
    const openApiDiffs = findDiffsInProperty(oldParsedSpec.openapi, newParsedSpec.openapi, 'openapi', 'non-breaking');
    const schemesDiffs = findDiffsInArray(oldParsedSpec.schemes, newParsedSpec.schemes, 'schemes');

    const topLevelXPropertyDiffs = findDiffsInXProperties(oldParsedSpec.xProperties,
        newParsedSpec.xProperties, 'xProperties');

    return _.concat([], infoDiffs, basePathDiffs, hostDiffs, openApiDiffs, schemesDiffs, topLevelXPropertyDiffs);
};

export default {
    diff: (oldParsedSpec: ParsedSpec,
           newParsedSpec: ParsedSpec): DiffEntry[] => {
        return findDiffsInSpecs(oldParsedSpec, newParsedSpec);
    }
};
