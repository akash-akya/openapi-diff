import {ParsedHeader, ParsedHeaders} from '../../spec-parser-types';
import {getAddedKeysFromObjects} from './common/get-added-keys-from-objects';
import {getCommonKeysFromObjects} from './common/get-common-keys-from-objects';
import {getRemovedKeysFromObjects} from './common/get-removed-keys-from-objects';
import {createDifference} from './create-difference';
import {Difference} from './difference';

const getHeaderDifferencePropertyName = (header: ParsedHeader): string => {
    return header.required.value
        ? 'response.required.header'
        : 'response.optional.header';
};

const createAddHeaderDifference = (header: ParsedHeader): Difference => {
    return createDifference({
        action: 'add',
        destinationSpecOrigins: [header.originalValue],
        propertyName: getHeaderDifferencePropertyName(header),
        source: 'openapi-diff',
        sourceSpecOrigins: []
    });
};

const createRemoveHeaderDifference = (header: ParsedHeader): Difference => {
    return createDifference({
        action: 'remove',
        destinationSpecOrigins: [],
        propertyName: getHeaderDifferencePropertyName(header),
        source: 'openapi-diff',
        sourceSpecOrigins: [header.originalValue]
    });
};

const findAddedDifferencesInHeaders = (
    sourceResponseHeaders: ParsedHeaders, destinationResponseHeaders: ParsedHeaders
): Difference[] => {
    const addedHeaders = getAddedKeysFromObjects(sourceResponseHeaders, destinationResponseHeaders);

    return addedHeaders.map((headerName) => {
        const addedHeader = destinationResponseHeaders[headerName];

        return createAddHeaderDifference(addedHeader);
    });
};

const findRequiredChangeDifferences = (
    sourceResponseHeader: ParsedHeader, destinationResponseHeader: ParsedHeader
): Difference[] => {
    const requiredChangeDifferences = [];

    if (sourceResponseHeader.required.value !== destinationResponseHeader.required.value) {
        requiredChangeDifferences.push(
            createRemoveHeaderDifference(sourceResponseHeader),
            createAddHeaderDifference(destinationResponseHeader)
        );
    }

    return requiredChangeDifferences;
};
const findDifferencesinMatchingHeaders = (
    sourceResponseHeaders: ParsedHeaders, destinationResponseHeaders: ParsedHeaders
): Difference[] => {
    const matchingHeaders = getCommonKeysFromObjects(sourceResponseHeaders, destinationResponseHeaders);

    return matchingHeaders.reduce<Difference[]>((accumulator, headerName) => {
        const sourceMatchingHeader = sourceResponseHeaders[headerName];
        const destinationMatchingHeader = destinationResponseHeaders[headerName];

        const requiredDifferences = findRequiredChangeDifferences(sourceMatchingHeader, destinationMatchingHeader);

        return accumulator.concat(requiredDifferences);
    }, []);
};

const findRemovedDifferencesInHeaders = (
    sourceResponseHeaders: ParsedHeaders, destinationResponseHeaders: ParsedHeaders
): Difference[] => {
    const removedHeaders = getRemovedKeysFromObjects(sourceResponseHeaders, destinationResponseHeaders);

    return removedHeaders.map((headerName) => {
        const removedHeader = sourceResponseHeaders[headerName];

        return createRemoveHeaderDifference(removedHeader);
    });
};

const normalizeHeaders = (responseHeaders: ParsedHeaders): ParsedHeaders => {
    return Object.keys(responseHeaders).reduce<ParsedHeaders>((accumulator, header) => {
        const lowerCaseHeaderKey = header.toLowerCase();
        accumulator[lowerCaseHeaderKey] = responseHeaders[header];

        return accumulator;
    }, {});
};

export const findDifferencesInResponseHeaders = (
    sourceResponseHeaders: ParsedHeaders, destinationResponseHeaders: ParsedHeaders
): Difference[] => {
    const normalizedSourceResponseHeaders = normalizeHeaders(sourceResponseHeaders);
    const normalizedDestinationResponseHeaders = normalizeHeaders(destinationResponseHeaders);

    const addedDifferences =
        findAddedDifferencesInHeaders(normalizedSourceResponseHeaders, normalizedDestinationResponseHeaders);
    const matchingDifferences =
        findDifferencesinMatchingHeaders(normalizedSourceResponseHeaders, normalizedDestinationResponseHeaders);
    const removedDifferences =
        findRemovedDifferencesInHeaders(normalizedSourceResponseHeaders, normalizedDestinationResponseHeaders);

    return [...addedDifferences, ...matchingDifferences, ...removedDifferences];
};
