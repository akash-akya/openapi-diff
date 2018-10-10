import {ParsedHeaders} from '../../spec-parser-types';
import {getAddedKeysFromObjects} from './common/get-added-keys-from-objects';
import {getRemovedKeysFromObjects} from './common/get-removed-keys-from-objects';
import {createDifference} from './create-difference';

const findAddedDifferencesInHeaders = (
    sourceResponseHeaders: ParsedHeaders,
    destinationResponseHeaders: ParsedHeaders
) => {
    const addedHeaders = getAddedKeysFromObjects(sourceResponseHeaders, destinationResponseHeaders);

    return addedHeaders.map((header) => {
        const addedHeader = destinationResponseHeaders[header];

        return createDifference({
            action: 'add',
            destinationSpecOrigins: [addedHeader.originalValue],
            propertyName: 'response.header',
            source: 'openapi-diff',
            sourceSpecOrigins: []
        });
    });
};

const findRemovedDifferencesInHeaders = (
    sourceResponseHeaders: ParsedHeaders,
    destinationResponseHeaders: ParsedHeaders
) => {
    const removedHeaders = getRemovedKeysFromObjects(sourceResponseHeaders, destinationResponseHeaders);

    return removedHeaders.map((header) => {
        const removedHeader = sourceResponseHeaders[header];

        return createDifference({
            action: 'remove',
            destinationSpecOrigins: [],
            propertyName: 'response.header',
            source: 'openapi-diff',
            sourceSpecOrigins: [removedHeader.originalValue]
        });
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
    sourceResponseHeaders: ParsedHeaders,
    destinationResponseHeaders: ParsedHeaders
) => {
    const normalizedSourceResponseHeaders = normalizeHeaders(sourceResponseHeaders);
    const normalizedDestinationResponseHeaders = normalizeHeaders(destinationResponseHeaders);

    const addedDifferences =
        findAddedDifferencesInHeaders(normalizedSourceResponseHeaders, normalizedDestinationResponseHeaders);
    const removedDifferences =
        findRemovedDifferencesInHeaders(normalizedSourceResponseHeaders, normalizedDestinationResponseHeaders);

    return [...addedDifferences, ...removedDifferences];
};
