import * as deepDiff from 'deep-diff';
import * as _ from 'lodash';

import utils from './utils';

import IDiff = deepDiff.IDiff;

import {
    ChangeTypeMapper,
    DiffEntry,
    DiffEntrySeverity,
    DiffEntryTaxonomy,
    DiffEntryType,
    ParsedSpec
} from './types';

const legacyProcessDiff = (parsedSpec: ParsedSpec, rawDiff: IDiff[] | undefined): DiffEntry[] => {

    const processedDiff: DiffEntry[] = [];

    if (rawDiff) {
        for (const entry of rawDiff) {

            const oldValue = getChangeDiffValue(entry, 'lhs');
            const newValue = getChangeDiffValue(entry, 'rhs');
            const scope = getChangeScope(entry);
            const type = getChangeType(entry);

            const taxonomy = findChangeTaxonomy(type, scope);

            const processedEntry = {
                index: entry.index,
                item: entry.item,
                kind: entry.kind,
                lhs: getChangeDiffValue(entry, 'lhs'),
                newValue,
                oldValue,
                path: entry.path,
                printablePath: utils.findOriginalPath(parsedSpec, entry.path),
                rhs: getChangeDiffValue(entry, 'rhs'),
                scope,
                severity: findChangeSeverity(taxonomy),
                taxonomy,
                type
            };

            const ignoredTaxonomies: string[] = [
                'basePath.property.add',
                'basePath.property.delete',
                'basePath.property.edit',
                'host.property.add',
                'host.property.delete',
                'host.property.edit',
                'openapi.property.edit',
                'schemes.property.add',
                'schemes.property.arrayContent.add',
                'schemes.property.arrayContent.delete',
                'schemes.property.delete',
                'schemes.property.edit'
            ];
            if (ignoredTaxonomies.indexOf(taxonomy) === -1) {
                processedDiff.push(processedEntry);
            }
        }
    }

    return processedDiff;
};

const changeTypeMapper: ChangeTypeMapper = {
    A: (change: IDiff) => {
        return (change.item && change.item.kind) ? changeTypeMapper[`A.${change.item.kind}`](change) : 'unknown';
    },
    'A.D': () => 'arrayContent.delete',
    'A.N': () => 'arrayContent.add',
    D: () => 'delete',
    E: () => 'edit',
    N: () => 'add'
};

const isInfoChange = (entry: IDiff): boolean => {
    return isInfoObject(entry) && !utils.isXProperty(entry.path[1]);
};

const isInfoObject = (entry: IDiff): boolean => {
    return entry.path[0] === 'info';
};

const topLevelPropertyNames: string[] = [
    'basePath',
    'host',
    'openapi',
    'schemes'
];

const isTopLevelProperty = (entry: IDiff): boolean => {
    return _.includes(topLevelPropertyNames, entry.path[0]);
};

const findChangeTaxonomy = (type: DiffEntryType, scope: string): DiffEntryTaxonomy => {
    return (scope === 'unclassified.change') ? scope as DiffEntryTaxonomy : `${scope}.${type}` as DiffEntryTaxonomy;
};

const findChangeSeverity = (taxonomy: DiffEntryTaxonomy): DiffEntrySeverity => {
    const isBreakingChange = _.includes(BreakingChanges, taxonomy);
    const isNonBreakingChange = _.includes(nonBreakingChanges, taxonomy);

    if (isBreakingChange) {
        return 'breaking';
    } else if (isNonBreakingChange) {
        return 'non-breaking';
    } else {
        return 'unclassified';
    }
};

const getChangeDiffValue = (change: IDiff, property: 'lhs' | 'rhs'): any => {
    return change[property] || _.get(change, `item.${property}`, null);
};

const getChangeScope = (change: IDiff): string => {
    if (isInfoChange(change)) {
        return 'info.object';
    } else if (isTopLevelProperty(change)) {
        return `${getTopLevelProperty(change)}.property`;
    } else {
        return 'unclassified.change';
    }
};

const getChangeType = (change: IDiff): DiffEntryType => {
    return changeTypeMapper[change.kind](change) || 'unknown';
};

const getTopLevelProperty = (entry: IDiff): string => {
    return entry.path[0];
};

const BreakingChanges: DiffEntryTaxonomy[] = [
    'basePath.property.add',
    'basePath.property.delete',
    'basePath.property.edit',
    'host.property.add',
    'host.property.delete',
    'host.property.edit',
    'schemes.property.add',
    'schemes.property.arrayContent.delete',
    'schemes.property.delete',
    'schemes.property.edit'
];

const nonBreakingChanges: DiffEntryTaxonomy[] = [
    'info.object.edit',
    'openapi.property.edit',
    'schemes.property.arrayContent.add'
];

const findTopLevelXPropertiesInSpec = (parsedSpec: ParsedSpec): string[] => {
    return _.filter(_.keys(parsedSpec), utils.isXProperty);
};

interface CreateDiffEntityOptions {
    oldObject: any;
    newObject: any;
    propertyName: string;
    type: DiffEntryType;
    severity: DiffEntrySeverity;
}

const createDiffEntity = ({oldObject, newObject, propertyName, type, severity}: CreateDiffEntityOptions): DiffEntry => {
    return {
        newValue: newObject ? newObject.value : undefined,
        oldValue: oldObject ? oldObject.value : undefined,
        printablePath: oldObject ? oldObject.originalPath : newObject.originalPath,
        scope: `${propertyName}.property`,
        severity,
        taxonomy: `${propertyName}.property.${type}` as DiffEntryTaxonomy,
        type
    };
};

const findAdditionDiffsInProperty = (oldObject: any,
                                     newObject: any,
                                     propertyName: string,
                                     severity: DiffEntrySeverity): DiffEntry[] => {
    const isAddition = _.isUndefined(oldObject.value) && !!newObject.value;

    if (isAddition) {
        return [createDiffEntity({newObject, oldObject, propertyName, severity, type: 'add'})];
    }

    return [];
};

const findDeletionDiffsInProperty = (oldObject: any,
                                     newObject: any,
                                     propertyName: string,
                                     severity: DiffEntrySeverity): DiffEntry[] => {
    const isDeletion = !!oldObject.value && _.isUndefined(newObject.value);

    if (isDeletion) {
        return [createDiffEntity({newObject, oldObject, propertyName, severity, type: 'delete'})];
    }

    return [];
};

const findEditionDiffsInProperty = (oldObject: any,
                                    newObject: any,
                                    propertyName: string,
                                    severity: DiffEntrySeverity): DiffEntry[] => {
    const isEdition = !!oldObject.value && !!newObject.value && (oldObject.value !== newObject.value);

    if (isEdition) {
        return [createDiffEntity({newObject, oldObject, propertyName, severity, type: 'edit'})];
    }

    return [];
};

const findDiffsInProperty = (oldParsedSpec: ParsedSpec,
                             newParsedSpec: ParsedSpec,
                             propertyName: string,
                             severity: DiffEntrySeverity): DiffEntry[] => {
    const oldObject = oldParsedSpec[propertyName];
    const newObject = newParsedSpec[propertyName];

    const additionDiffs: DiffEntry[] = findAdditionDiffsInProperty(oldObject, newObject, propertyName, severity);
    const deletionDiffs: DiffEntry[] = findDeletionDiffsInProperty(oldObject, newObject, propertyName, severity);
    const editionDiffs: DiffEntry[] = findEditionDiffsInProperty(oldObject, newObject, propertyName, severity);

    return _.concat<DiffEntry>([], additionDiffs, deletionDiffs, editionDiffs);
};

const isValueInArray = (object: any, array: any[]): boolean => {
    return _.some(array, {value: object.value});
};

const findAdditionDiffsInArray = (oldArrayContent: any[],
                                  newArrayContent: any[],
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

const findDeletionDiffsInArray = (oldArrayContent: any[],
                                  newArrayContent: any[],
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

const findDiffsInArray = (oldParsedSpec: ParsedSpec,
                          newParsedSpec: ParsedSpec,
                          objectName: string): DiffEntry[] => {

    const oldArray = oldParsedSpec[objectName];
    const newArray = newParsedSpec[objectName];

    const arrayAdditionDiffs: DiffEntry[] = findAdditionDiffsInProperty(oldArray, newArray, objectName, 'breaking');
    const arrayDeletionDiffs: DiffEntry[] = findDeletionDiffsInProperty(oldArray, newArray, objectName, 'breaking');

    let arrayContentAdditionDiffs: DiffEntry[] = [];

    if (!arrayAdditionDiffs.length) {
        const oldArrayContent = oldParsedSpec[objectName].value;
        const newArrayContent = newParsedSpec[objectName].value;

        arrayContentAdditionDiffs = findAdditionDiffsInArray(oldArrayContent,
            newArrayContent,
            objectName,
            'non-breaking');
    }

    let arrayContentDeletionDiffs: DiffEntry[] = [];

    if (!arrayDeletionDiffs.length) {
        const oldArrayContent = oldParsedSpec[objectName].value;
        const newArrayContent = newParsedSpec[objectName].value;

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

const findDiffsInCollectionOfProperties = (oldParsedSpec: ParsedSpec,
                                           newParsedSpec: ParsedSpec,
                                           properties: string[],
                                           severity: DiffEntrySeverity): DiffEntry[] => {

    const property = properties[0];
    return findDiffsInProperty(oldParsedSpec, newParsedSpec, property, severity);
};

const findDiffsInSpecs = (oldParsedSpec: ParsedSpec, newParsedSpec: ParsedSpec): DiffEntry[] => {
    const xProperties = _.uniq(_.concat(findTopLevelXPropertiesInSpec(oldParsedSpec),
        findTopLevelXPropertiesInSpec(newParsedSpec)));

    const basePathDiffs = findDiffsInProperty(oldParsedSpec, newParsedSpec, 'basePath', 'breaking');
    const hostDiffs = findDiffsInProperty(oldParsedSpec, newParsedSpec, 'host', 'breaking');
    const openApiDiffs = findDiffsInProperty(oldParsedSpec, newParsedSpec, 'openapi', 'non-breaking');
    const schemesDiffs = findDiffsInArray(oldParsedSpec, newParsedSpec, 'schemes');

    return _.concat<DiffEntry>([], basePathDiffs, hostDiffs, openApiDiffs, schemesDiffs);
};

export default {
    diff: (oldParsedSpec: ParsedSpec,
           newParsedSpec: ParsedSpec): DiffEntry[] => {
        const rawDiff: IDiff[] = deepDiff.diff(oldParsedSpec, newParsedSpec);
        const legacyProcessedDiff: DiffEntry[] = legacyProcessDiff(oldParsedSpec, rawDiff);
        const processedDiff = findDiffsInSpecs(oldParsedSpec, newParsedSpec);
        return legacyProcessedDiff.concat(processedDiff);
    }
};
