import * as deepDiff from 'deep-diff';
import * as _ from 'lodash';
import IDiff = deepDiff.IDiff;

import utils from './utils';

import {
    Diff,
    DiffChange, DiffChangeTaxonomy,
    DiffChangeType, OpenAPI3Spec,
    ParsedSpec,
    ResultDiff, Swagger2Spec
} from './types';

const processDiff = (rawDiff: IDiff[]): DiffChange[] => {

    const processedDiff: DiffChange[] = [];

    if (hasChanges(rawDiff)) {
        for (const entry of rawDiff) {

            const processedEntry: DiffChange = {
                index: getChangeNullableProperties(entry.index),
                item: getChangeNullableProperties(entry.item),
                kind: entry.kind,
                lhs: entry.lhs,
                path: entry.path,
                printablePath: [],
                rhs: entry.rhs,
                taxonomy: findChangeTaxonomy(entry),
                type: findChangeType(entry)
            };

            processedDiff.push(processedEntry);
        }
    }

    return processedDiff;
};

const isEdit = (entry: IDiff): boolean => {
    return entry.kind === 'E';
};

const isInfoObject = (entry: IDiff): boolean => {
    return entry.path[0] === 'info';
};

const isOpenapiProperty = (entry: IDiff): boolean => {
    return entry.path[0] === 'openapi';
};

const isInfoChange = (entry: IDiff): boolean => {
    return isEdit(entry) && isInfoObject(entry) && !utils.isXProperty(entry.path[1]);
};

const isOpenapiChange = (entry: IDiff): boolean => {
    return isEdit(entry) && isOpenapiProperty(entry);
};

const isSwagger2Spec = (spec: Swagger2Spec | OpenAPI3Spec): boolean => {
    return !!spec.swagger;
};

const hasChanges = (rawDiff: IDiff[]): boolean => {
    return !_.isUndefined(rawDiff);
};

const findChangeTaxonomy = (change: IDiff): DiffChangeTaxonomy => {
    if (isInfoChange(change)) {
        return 'info.object.edit';
    } else if (isOpenapiChange (change)) {
        return 'openapi.property.edit';
    } else {
        // TODO: remove zzz
        return 'zzz.unclassified.change';
    }
};

const findChangeType = (change: IDiff): DiffChangeType => {
    if (isInfoChange(change) || isOpenapiChange (change)) {
        return 'non-breaking';
    } else {
        return 'unclassified';
    }
};

const findOpenApiPrintablePath = (spec: Swagger2Spec | OpenAPI3Spec): string[] => {
    const processedPrintablePath: string[] = isSwagger2Spec(spec) ? ['swagger'] : ['openapi'];
    return processedPrintablePath;
};

const getChangeNullableProperties = (changeProperty: any): any => {
    return changeProperty || null;
};

const populatePrintablePaths = (oldSpec: Swagger2Spec | OpenAPI3Spec,
                                processedDiff: DiffChange[]): DiffChange[] => {

    const populatedDiff: DiffChange[] = [];

    for (const entry of processedDiff) {
        const processedEntry = _.cloneDeep(entry);
        processedEntry.printablePath = isOpenapiChange(entry) ? findOpenApiPrintablePath(oldSpec) : processedEntry.path;
        populatedDiff.push(processedEntry);
    }

    return populatedDiff;
};

const sortProcessedDiff = (processedDiff: DiffChange[]): ResultDiff => {
    const results: ResultDiff = {
        breakingChanges: _.filter(processedDiff, ['type', 'breaking']),
        nonBreakingChanges: _.filter(processedDiff, ['type', 'non-breaking']),
        unclassifiedChanges: _.filter(processedDiff, ['type', 'unclassified'])
    };
    return results;
};

export default {
    diff: (oldSpec: Swagger2Spec | OpenAPI3Spec,
           oldParsedSpec: ParsedSpec,
           newParsedSpec: ParsedSpec): Diff => {
        const rawDiff: IDiff[] = deepDiff.diff(oldParsedSpec, newParsedSpec);
        const processedDiff: DiffChange[] = processDiff(rawDiff);
        const completeDiff: DiffChange[] = populatePrintablePaths(oldSpec, processedDiff);
        const resultingDiff = sortProcessedDiff(completeDiff);
        return resultingDiff;
    }
};
