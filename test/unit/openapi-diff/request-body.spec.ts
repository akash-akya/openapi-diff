import {DiffOutcomeFailure} from '../../../lib/api-types';
import {breakingDiffResultBuilder, nonBreakingDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openApi3ComponentsBuilder} from '../../support/builders/openapi3-components-builder';
import {openApi3OperationBuilder} from '../../support/builders/openapi3-operation-builder';
import {openApi3PathItemBuilder} from '../../support/builders/openapi3-path-item-builder';
import {
    OpenApi3RequestBodyBuilder,
    openApi3RequestBodyBuilder
} from '../../support/builders/openapi3-request-body-builder';
import {openApi3SpecBuilder} from '../../support/builders/openapi3-spec-builder';
import {refObjectBuilder} from '../../support/builders/ref-object-builder';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('openapi-diff request-body', () => {
    const defaultPath = '/some/path';
    const defaultMethod = 'post';

    const createSpecWithRequestBody = (requestBody: OpenApi3RequestBodyBuilder) => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withRequestBody(requestBody)));
    };

    it('should return no differences for the same spec', async () => {
        const aSpec = createSpecWithRequestBody(openApi3RequestBodyBuilder);

        const outcome = await whenSpecsAreDiffed(aSpec, aSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should return a breaking and non-breaking differences if request schema scope is changed', async () => {
        const sourceSpec = createSpecWithRequestBody(
            openApi3RequestBodyBuilder.withJsonContentSchema({type: 'string'})
        );

        const destinationSpec = createSpecWithRequestBody(
            openApi3RequestBodyBuilder.withJsonContentSchema({type: 'number'})
        );

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const typeChangeLocation =
            `paths.${defaultPath}.${defaultMethod}.requestBody.content.application/json.schema.type`;
        expect(outcome).toContainDifferences([
            nonBreakingDiffResultBuilder
                .withAction('add')
                .withCode('request.body.scope.add')
                .withEntity('request.body.scope')
                .withSource('json-schema-diff')
                .withSourceSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation(typeChangeLocation)
                        .withValue('string')
                ])
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation(typeChangeLocation)
                        .withValue('number')
                ])
                .withDetails({value: 'number'})
                .build(),
            breakingDiffResultBuilder
                .withAction('remove')
                .withCode('request.body.scope.remove')
                .withEntity('request.body.scope')
                .withSource('json-schema-diff')
                .withSourceSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation(typeChangeLocation)
                        .withValue('string')
                ])
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation(typeChangeLocation)
                        .withValue('number')
                ])
                .withDetails({value: 'string'})
                .build()
        ]);
    });

    it('should find differences for request bodies in all operations', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation('put', openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder.withJsonContentSchema({type: 'string'})))
                .withOperation('post', openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder.withJsonContentSchema({type: 'string'}))));
        const destinationSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation('put', openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder.withJsonContentSchema({type: 'number'})))
                .withOperation('post', openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder.withJsonContentSchema({type: 'number'}))));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome.nonBreakingDifferences.length).toBe(2, 'find differences in all operations of a path');
    });

    it('should return differences, when a request body schema did not exist and was added', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withNoRequestBody()));
        const destinationSpec = createSpecWithRequestBody(
            openApi3RequestBodyBuilder.withJsonContentSchema(
                {type: 'string'}));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const baseBreakingDifference = breakingDiffResultBuilder
            .withAction('remove')
            .withCode('request.body.scope.remove')
            .withEntity('request.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(
                        `paths.${defaultPath}.${defaultMethod}.requestBody.content.application/json.schema.type`)
                    .withValue('string')
            ]);
        expect(outcome).toContainDifferences([
            baseBreakingDifference.withDetails({value: 'boolean'}).build(),
            baseBreakingDifference.withDetails({value: 'object'}).build(),
            baseBreakingDifference.withDetails({value: 'integer'}).build(),
            baseBreakingDifference.withDetails({value: 'number'}).build(),
            baseBreakingDifference.withDetails({value: 'array'}).build(),
            baseBreakingDifference.withDetails({value: 'null'}).build()
        ]);
    });

    it('should find differences in request bodies with references', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withSchema('stringSchema', {type: 'string'})
                .withSchema('requestBodySchema', {$ref: '#/components/schemas/stringSchema'})
                .withRequestBody(
                    'RequestBody', openApi3RequestBodyBuilder.withSchemaRef('#/components/schemas/requestBodySchema'
                    )))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withRequestBody(refObjectBuilder.withRef('#/components/requestBodies/RequestBody'))));

        const destinationSpec = createSpecWithRequestBody(
            openApi3RequestBodyBuilder.withJsonContentSchema({type: 'number'})
        );

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome.nonBreakingDifferences.length).toBe(1);
        expect((outcome as DiffOutcomeFailure).nonBreakingDifferences.length).toBe(1);
    });
});
