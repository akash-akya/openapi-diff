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
                'schemes.property.edit',
                'unclassified.change'
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

const createDiffEntity = ({oldObject, newObject, propertyName, type, severity}: CreateDiffEntityOptions): DiffEntry => {
    const scope = findScopeForDiff(propertyName);

    return {
        newValue: newObject ? newObject.value : undefined,
        oldValue: oldObject ? oldObject.value : undefined,
        printablePath: oldObject ? oldObject.originalPath : newObject.originalPath,
        scope,
        severity,
        taxonomy: `${scope}.${type}` as DiffEntryTaxonomy,
        type
    };
};

const findAdditionDiffsInProperty = (oldObject: any,
                                     newObject: any,
                                     propertyName: string,
                                     severity: DiffEntrySeverity): DiffEntry[] => {
    const isAddition = (_.isUndefined(oldObject) || _.isUndefined(oldObject.value)) && !!newObject.value;

    if (isAddition) {
        return [createDiffEntity({newObject, oldObject, propertyName, severity, type: 'add'})];
    }

    return [];
};

const findDeletionDiffsInProperty = (oldObject: any,
                                     newObject: any,
                                     propertyName: string,
                                     severity: DiffEntrySeverity): DiffEntry[] => {
    const isDeletion = (!_.isUndefined(oldObject) && !!oldObject.value) && _.isUndefined(newObject.value);

    if (isDeletion) {
        return [createDiffEntity({newObject, oldObject, propertyName, severity, type: 'delete'})];
    }

    return [];
};

const findEditionDiffsInProperty = (oldObject: any,
                                    newObject: any,
                                    propertyName: string,
                                    severity: DiffEntrySeverity): DiffEntry[] => {
    const isEdition = (!_.isUndefined(oldObject) && !!oldObject.value) && !!newObject.value && (oldObject.value !== newObject.value);

    if (isEdition) {
        return [createDiffEntity({newObject, oldObject, propertyName, severity, type: 'edit'})];
    }

    return [];
};

const findDiffsInProperty = (oldParsedSpec: ParsedSpec,
                             newParsedSpec: ParsedSpec,
                             propertyName: string,
                             severity: DiffEntrySeverity): DiffEntry[] => {

    const oldObject = _.get(oldParsedSpec, propertyName);
    const newObject = _.get(newParsedSpec, propertyName);

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

const findDiffsInSpecs = (oldParsedSpec: ParsedSpec, newParsedSpec: ParsedSpec): DiffEntry[] => {
    const xPropertyUniqueNames = _.uniq(_.concat([],
        _.keys(oldParsedSpec.xProperties),
        _.keys(newParsedSpec.xProperties)));

    const basePathDiffs = findDiffsInProperty(oldParsedSpec, newParsedSpec, 'basePath', 'breaking');
    const hostDiffs = findDiffsInProperty(oldParsedSpec, newParsedSpec, 'host', 'breaking');
    const openApiDiffs = findDiffsInProperty(oldParsedSpec, newParsedSpec, 'openapi', 'non-breaking');
    const schemesDiffs = findDiffsInArray(oldParsedSpec, newParsedSpec, 'schemes');

    let xPropertyDiffs: DiffEntry[] = [];
    for (const xPropertyName of xPropertyUniqueNames) {
        const newDiffs = findDiffsInProperty(
            oldParsedSpec,
            newParsedSpec,
            `xProperties.${xPropertyName}`,
            'unclassified'
        );
        xPropertyDiffs = _.concat(xPropertyDiffs, _.flattenDeep(newDiffs));
    }

    return _.concat<DiffEntry>([], basePathDiffs, hostDiffs, openApiDiffs, schemesDiffs, xPropertyDiffs);
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
