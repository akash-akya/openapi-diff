import {ParsedRequestBody} from '../../spec-parser-types';
import {Difference} from './difference';
import {getScopeAddDifferences, getScopeRemoveDifferences} from './get-scope-differences';
import {getSchemaDifferences} from './json-schema-diff';

export const findDifferencesInRequestBodies = async (
    sourceRequestBody: ParsedRequestBody, destinationRequestBody: ParsedRequestBody
): Promise<Difference[]> => {
    const diffResults = await getSchemaDifferences(sourceRequestBody, destinationRequestBody);

    const requestBodyScopeOptions = {
        addedJsonSchema: diffResults.addedJsonSchema,
        additionsFound: diffResults.additionsFound,
        destinationScope: destinationRequestBody,
        propertyName: 'request.body.scope',
        removalsFound: diffResults.removalsFound,
        removedJsonSchema: diffResults.removedJsonSchema,
        sourceScope: sourceRequestBody
    };

    const addedScopeDifferences = getScopeAddDifferences(requestBodyScopeOptions);
    const removedScopeDifferences = getScopeRemoveDifferences(requestBodyScopeOptions);

    return [...addedScopeDifferences, ...removedScopeDifferences];
};
