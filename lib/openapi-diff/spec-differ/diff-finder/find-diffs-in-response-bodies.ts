import {ParsedResponse} from '../../spec-parser-types';
import {Difference} from './difference';
import {getScopeAddDifferences, getScopeRemoveDifferences} from './get-scope-differences';
import {getSchemaDifferences} from './json-schema-diff';

export const findDifferencesInResponseBodies = async (
    sourceResponseBody: ParsedResponse, destinationResponseBody: ParsedResponse
): Promise<Difference[]> => {
    const diffResults = await getSchemaDifferences(sourceResponseBody, destinationResponseBody);

    const responseBodyScopeOptions = {
        destinationScope: destinationResponseBody,
        differences: diffResults.differences,
        propertyName: 'response.body.scope',
        sourceScope: sourceResponseBody
    };

    const addedScopeDifferences = getScopeAddDifferences(responseBodyScopeOptions);
    const removedScopeDifferences = getScopeRemoveDifferences(responseBodyScopeOptions);

    return [...addedScopeDifferences, ...removedScopeDifferences];
};
