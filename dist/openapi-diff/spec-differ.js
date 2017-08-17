"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const VError = require("verror");
const severity_finder_1 = require("./severity-finder");
const findPrintablePathForDiff = (options) => {
    if (_.isUndefined(options.oldObject) && _.isUndefined(options.newObject)) {
        throw new VError(`ERROR: impossible to find the path for ${options.propertyName} - ${options.type}`);
    }
    return options.oldObject ?
        options.oldObject.originalPath :
        options.newObject.originalPath;
};
const findScopeForDiff = (propertyName) => {
    return propertyName.includes('xProperties') ? 'unclassified' : propertyName;
};
const createDiffEntry = (options) => {
    const printablePath = findPrintablePathForDiff(options);
    const scope = findScopeForDiff(options.propertyName);
    const taxonomy = `${scope}.${options.type}`;
    const severity = severity_finder_1.default.lookup(taxonomy);
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
const isDefined = (target) => {
    return !_.isUndefined(target);
};
const isDefinedDeep = (objectWithValue) => {
    return isDefined(objectWithValue) && isDefined(objectWithValue.value);
};
const isUndefinedDeep = (objectWithValue) => {
    return _.isUndefined(objectWithValue) || _.isUndefined(objectWithValue.value);
};
const findAdditionDiffsInProperty = (oldObject, newObject, propertyName) => {
    const isAddition = isUndefinedDeep(oldObject) && isDefinedDeep(newObject);
    if (isAddition) {
        return [createDiffEntry({ newObject, oldObject, propertyName, type: 'add' })];
    }
    return [];
};
const findDeletionDiffsInProperty = (oldObject, newObject, propertyName) => {
    const isDeletion = isDefinedDeep(oldObject) && isUndefinedDeep(newObject);
    if (isDeletion) {
        return [createDiffEntry({ newObject, oldObject, propertyName, type: 'delete' })];
    }
    return [];
};
const findEditionDiffsInProperty = (oldObject, newObject, propertyName) => {
    const isEdition = isDefinedDeep(oldObject) && isDefinedDeep(newObject) && (oldObject.value !== newObject.value);
    if (isEdition) {
        return [createDiffEntry({ newObject, oldObject, propertyName, type: 'edit' })];
    }
    return [];
};
const findDiffsInProperty = (oldObject, newObject, propertyName) => {
    const additionDiffs = findAdditionDiffsInProperty(oldObject, newObject, propertyName);
    const deletionDiffs = findDeletionDiffsInProperty(oldObject, newObject, propertyName);
    const editionDiffs = findEditionDiffsInProperty(oldObject, newObject, propertyName);
    return _.concat([], additionDiffs, deletionDiffs, editionDiffs);
};
const isValueInArray = (object, array) => {
    return _.some(array, { value: object.value });
};
const findAdditionDiffsInArray = (oldArrayContent, newArrayContent, arrayName) => {
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
        .flatten()
        .value();
    return arrayContentAdditionDiffs;
};
const findDeletionDiffsInArray = (oldArrayContent, newArrayContent, arrayName) => {
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
        .flatten()
        .value();
    return arrayContentDeletionDiffs;
};
const findDiffsInArray = (oldArray, newArray, objectName) => {
    const arrayAdditionDiffs = findAdditionDiffsInProperty(oldArray, newArray, objectName);
    const arrayDeletionDiffs = findDeletionDiffsInProperty(oldArray, newArray, objectName);
    let arrayContentAdditionDiffs = [];
    if (!arrayAdditionDiffs.length) {
        const oldArrayContent = oldArray.value;
        const newArrayContent = newArray.value;
        arrayContentAdditionDiffs = findAdditionDiffsInArray(oldArrayContent, newArrayContent, objectName);
    }
    let arrayContentDeletionDiffs = [];
    if (!arrayDeletionDiffs.length) {
        const oldArrayContent = oldArray.value;
        const newArrayContent = newArray.value;
        arrayContentDeletionDiffs = findDeletionDiffsInArray(oldArrayContent, newArrayContent, objectName);
    }
    return _.concat([], arrayAdditionDiffs, arrayDeletionDiffs, arrayContentAdditionDiffs, arrayContentDeletionDiffs);
};
const findDiffsInXProperties = (oldParsedXProperties, newParsedXProperties, xPropertyContainerName) => {
    const xPropertyUniqueNames = _(_.keys(oldParsedXProperties))
        .concat(_.keys(newParsedXProperties))
        .uniq()
        .value();
    const xPropertyDiffs = _(xPropertyUniqueNames)
        .map((xPropertyName) => {
        return findDiffsInProperty(oldParsedXProperties[xPropertyName], newParsedXProperties[xPropertyName], `${xPropertyContainerName}.${xPropertyName}`);
    })
        .flatten()
        .value();
    return xPropertyDiffs;
};
const findDiffsInSpecs = (oldParsedSpec, newParsedSpec) => {
    const infoDiffs = _.concat([], findDiffsInProperty(oldParsedSpec.info.termsOfService, newParsedSpec.info.termsOfService, 'info.termsOfService'), findDiffsInProperty(oldParsedSpec.info.description, newParsedSpec.info.description, 'info.description'), findDiffsInProperty(oldParsedSpec.info.contact.name, newParsedSpec.info.contact.name, 'info.contact.name'), findDiffsInProperty(oldParsedSpec.info.contact.email, newParsedSpec.info.contact.email, 'info.contact.email'), findDiffsInProperty(oldParsedSpec.info.contact.url, newParsedSpec.info.contact.url, 'info.contact.url'), findDiffsInProperty(oldParsedSpec.info.license.name, newParsedSpec.info.license.name, 'info.license.name'), findDiffsInProperty(oldParsedSpec.info.license.url, newParsedSpec.info.license.url, 'info.license.url'), findDiffsInProperty(oldParsedSpec.info.title, newParsedSpec.info.title, 'info.title'), findDiffsInProperty(oldParsedSpec.info.version, newParsedSpec.info.version, 'info.version'), findDiffsInXProperties(oldParsedSpec.info.xProperties, newParsedSpec.info.xProperties, 'info.xProperties'));
    const basePathDiffs = findDiffsInProperty(oldParsedSpec.basePath, newParsedSpec.basePath, 'basePath');
    const hostDiffs = findDiffsInProperty(oldParsedSpec.host, newParsedSpec.host, 'host');
    const openApiDiffs = findDiffsInProperty(oldParsedSpec.openapi, newParsedSpec.openapi, 'openapi');
    const schemesDiffs = findDiffsInArray(oldParsedSpec.schemes, newParsedSpec.schemes, 'schemes');
    const topLevelXPropertyDiffs = findDiffsInXProperties(oldParsedSpec.xProperties, newParsedSpec.xProperties, 'xProperties');
    return _.concat([], infoDiffs, basePathDiffs, hostDiffs, openApiDiffs, schemesDiffs, topLevelXPropertyDiffs);
};
exports.default = {
    diff: (oldParsedSpec, newParsedSpec) => {
        return findDiffsInSpecs(oldParsedSpec, newParsedSpec);
    }
};
