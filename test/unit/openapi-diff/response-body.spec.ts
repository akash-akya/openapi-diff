import {DiffOutcomeFailure} from '../../../lib/api-types';
import {breakingDiffResultBuilder, nonBreakingDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openApi3ComponentsBuilder} from '../../support/builders/openapi3-components-builder';
import {openApi3OperationBuilder} from '../../support/builders/openapi3-operation-builder';
import {openApi3PathItemBuilder} from '../../support/builders/openapi3-path-item-builder';
import {openApi3ResponseBuilder} from '../../support/builders/openapi3-response-builder';
import {
    OpenApi3ResponseContentBuilder,
    openApi3ResponseContentBuilder
} from '../../support/builders/openapi3-response-content-builder';
import {OpenApi3SpecBuilder, openApi3SpecBuilder} from '../../support/builders/openapi3-spec-builder';
import {refObjectBuilder} from '../../support/builders/ref-object-builder';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('openapi-diff response-body', () => {
    const defaultPath = '/some/path';
    const defaultMethod = 'post';
    const defaultStatusCode = '200';

    const defaultTypeChangeLocation =
        `paths.${defaultPath}.${defaultMethod}.responses.${defaultStatusCode}.content.application/json.schema.type`;

    const createSpecWithNoResponseBody = (): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withNoResponseBody())));
    };

    const createSpecWithResponseBody = (responseBody: OpenApi3ResponseContentBuilder): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withResponseBody(responseBody))));
    };

    it('should return no differences for the same spec', async () => {
        const aSpec = createSpecWithResponseBody(openApi3ResponseContentBuilder);

        const outcome = await whenSpecsAreDiffed(aSpec, aSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should return differences, when a response body schema did exist and was removed', async () => {
        const sourceSpec = createSpecWithResponseBody(openApi3ResponseContentBuilder
            .withJsonContentSchema({type: 'string'}));
        const destinationSpec = createSpecWithNoResponseBody();

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const baseBreakingDifference = breakingDiffResultBuilder
            .withAction('add')
            .withCode('response.body.scope.add')
            .withEntity('response.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
                    .withValue('string')
            ])
            .withDestinationSpecEntityDetails([]);

        expect(outcome).toContainDifferences([
            baseBreakingDifference.withDetails({value: 'boolean'}).build(),
            baseBreakingDifference.withDetails({value: 'object'}).build(),
            baseBreakingDifference.withDetails({value: 'integer'}).build(),
            baseBreakingDifference.withDetails({value: 'number'}).build(),
            baseBreakingDifference.withDetails({value: 'array'}).build(),
            baseBreakingDifference.withDetails({value: 'null'}).build()
        ]);
    });

    it('should return differences, when a response body schema was added', async () => {
        const sourceSpec = createSpecWithNoResponseBody();
        const destinationSpec = createSpecWithResponseBody(openApi3ResponseContentBuilder
            .withJsonContentSchema({type: 'string'}));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const baseNonBreakingDifference = nonBreakingDiffResultBuilder
            .withAction('remove')
            .withCode('response.body.scope.remove')
            .withEntity('response.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
                    .withValue('string')
            ]);

        expect(outcome).toContainDifferences([
            baseNonBreakingDifference.withDetails({value: 'boolean'}).build(),
            baseNonBreakingDifference.withDetails({value: 'object'}).build(),
            baseNonBreakingDifference.withDetails({value: 'integer'}).build(),
            baseNonBreakingDifference.withDetails({value: 'number'}).build(),
            baseNonBreakingDifference.withDetails({value: 'array'}).build(),
            baseNonBreakingDifference.withDetails({value: 'null'}).build()
        ]);
    });

    it('should return a breaking and non-breaking differences if response schema scope is changed', async () => {
        const sourceSpec = createSpecWithResponseBody(openApi3ResponseContentBuilder
            .withJsonContentSchema({type: 'string'}));
        const destinationSpec = createSpecWithResponseBody(openApi3ResponseContentBuilder
            .withJsonContentSchema({type: 'number'}));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const nonBreakingDifference = nonBreakingDiffResultBuilder
            .withAction('remove')
            .withCode('response.body.scope.remove')
            .withDetails({value: 'string'})
            .withEntity('response.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
                    .withValue('string')
            ])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
                    .withValue('number')
            ])
            .build();

        const breakingDifference = breakingDiffResultBuilder
            .withAction('add')
            .withCode('response.body.scope.add')
            .withDetails({value: 'number'})
            .withEntity('response.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
                    .withValue('string')
            ])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
                    .withValue('number')
            ])
            .build();

        expect(outcome).toContainDifferences([nonBreakingDifference, breakingDifference]);
    });

    it('should find differences in multiple status codes', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse('200', openApi3ResponseBuilder
                        .withResponseBody(openApi3ResponseContentBuilder
                            .withJsonContentSchema({type: 'string'})))
                    .withResponse('201', openApi3ResponseBuilder
                        .withResponseBody(openApi3ResponseContentBuilder
                            .withJsonContentSchema({type: 'string'})))));
        const destinationSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse('200', openApi3ResponseBuilder
                        .withResponseBody(openApi3ResponseContentBuilder
                            .withJsonContentSchema({type: 'number'})))
                    .withResponse('201', openApi3ResponseBuilder
                        .withResponseBody(openApi3ResponseContentBuilder
                            .withJsonContentSchema({type: 'number'})))));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome.nonBreakingDifferences.length).toBe(2);
        expect((outcome as DiffOutcomeFailure).breakingDifferences.length).toBe(2);
    });

    it('should find differences in response bodies with references', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withSchema('stringSchema', {type: 'string'})
                .withSchema('responseBodySchema', {$ref: '#/components/schemas/stringSchema'})
                .withResponse('aResponse', openApi3ResponseBuilder
                    .withResponseBody(openApi3ResponseContentBuilder
                        .withSchemaRef('#/components/schemas/responseBodySchema'))))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, refObjectBuilder
                        .withRef('#/components/responses/aResponse'))));
        const destinationSpec = createSpecWithResponseBody(openApi3ResponseContentBuilder
            .withJsonContentSchema({type: 'number'}));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome.nonBreakingDifferences.length).toBe(1);
        expect((outcome as DiffOutcomeFailure).breakingDifferences.length).toBe(1);
    });
});
