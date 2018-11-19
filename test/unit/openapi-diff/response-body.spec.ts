import {DiffOutcomeFailure, OpenApiDiffError} from '../../../lib/api-types';
import {OpenApi3Schema} from '../../../lib/openapi-diff/openapi3';
import {breakingDiffResultBuilder, nonBreakingDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openApi3ComponentsBuilder} from '../../support/builders/openapi3-components-builder';
import {openApi3MediaTypeBuilder} from '../../support/builders/openapi3-media-type-builder';
import {openApi3OperationBuilder} from '../../support/builders/openapi3-operation-builder';
import {openApi3PathItemBuilder} from '../../support/builders/openapi3-path-item-builder';
import {openApi3ResponseBuilder} from '../../support/builders/openapi3-response-builder';
import {openApi3SpecBuilder, OpenApi3SpecBuilder} from '../../support/builders/openapi3-spec-builder';
import {refObjectBuilder} from '../../support/builders/ref-object-builder';
import {expectToFail} from '../../support/expect-to-fail';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('openapi-diff response-body', () => {
    const defaultPath = '/some/path';
    const defaultMethod = 'post';
    const defaultStatusCode = '200';
    const defaultMediaType = 'application/json';

    const defaultTypeChangeLocation =
        `paths.${defaultPath}.${defaultMethod}.responses.${defaultStatusCode}.content.${defaultMediaType}.schema.type`;

    const createSpecWithResponseBodyWithoutSchema = (): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder))));
    };

    const createSpecWithResponseBodySchema = (schema: OpenApi3Schema): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema(schema)))));
    };

    const createSpecWithResponseBodySchemaType = (type: 'string' | 'number'): OpenApi3SpecBuilder =>
        createSpecWithResponseBodySchema({type});

    it('should return no differences for the same spec', async () => {
        const aSpec = createSpecWithResponseBodySchemaType('string');

        const outcome = await whenSpecsAreDiffed(aSpec, aSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should return breaking differences, when a response body schema did exist and was removed', async () => {
        const sourceSpec = createSpecWithResponseBodySchemaType('string');
        const destinationSpec = createSpecWithResponseBodyWithoutSchema();

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

    it('should return non-breaking differences, when a response body schema did not exist and was added', async () => {
        const sourceSpec = createSpecWithResponseBodyWithoutSchema();
        const destinationSpec = createSpecWithResponseBodySchemaType('string');

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
        const sourceSpec = createSpecWithResponseBodySchemaType('string');
        const destinationSpec = createSpecWithResponseBodySchemaType('number');

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
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({type: 'string'})))
                    .withResponse('201', openApi3ResponseBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({type: 'string'})))));
        const destinationSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({type: 'number'})))
                    .withResponse('201', openApi3ResponseBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
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
                    .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                        .withSchemaRef('#/components/schemas/responseBodySchema'))))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, refObjectBuilder
                        .withRef('#/components/responses/aResponse'))));
        const destinationSpec = createSpecWithResponseBodySchemaType('number');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome.nonBreakingDifferences.length).toBe(1);
        expect((outcome as DiffOutcomeFailure).breakingDifferences.length).toBe(1);
    });

    it('should handle the case of a circular response body schema', async () => {
        const spec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withSchema('stringSchema',
                    {
                        additionalProperties: {$ref: '#/components/schemas/stringSchema'},
                        type: 'object'
                    }))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withSchemaRef('#/components/schemas/stringSchema')))));

        const error = await expectToFail(whenSpecsAreDiffed(spec, spec));

        expect(error.message).toContain('Circular $ref pointer found');
        expect((error as OpenApiDiffError).code).toEqual('OPENAPI_DIFF_DIFF_ERROR');
    });

    it('should handle the case of a circular response body schema when response is a reference itself', async () => {
        const spec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withSchema('stringSchema',
                    {
                        additionalProperties: {$ref: '#/components/schemas/stringSchema'},
                        type: 'object'
                    })
                .withResponse('responseReference', openApi3ResponseBuilder
                    .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                        .withSchemaRef('#/components/schemas/stringSchema'))))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, refObjectBuilder
                        .withRef('#/components/responses/responseReference'))));

        const error = await expectToFail(whenSpecsAreDiffed(spec, spec));

        expect(error.message).toContain('Circular $ref pointer found');
        expect((error as OpenApiDiffError).code).toEqual('OPENAPI_DIFF_DIFF_ERROR');
    });

    it('should handle the case of a circular response body schema when response is a deep reference', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withResponse('nonCircularReferenceA', refObjectBuilder
                    .withRef('#/components/responses/nonCircularReferenceB'))
                .withResponse('nonCircularReferenceB', openApi3ResponseBuilder
                    .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                        .withJsonContentSchema({type: 'number'}))
                    .withMediaType('application/xml', openApi3MediaTypeBuilder
                        .withSchemaRef('#/x-circular-schema/schemaThatPreventsDereferencing'))))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, refObjectBuilder
                        .withRef('#/components/responses/nonCircularReferenceA'))))
            .withTopLevelXProperty('x-circular-schema', {
                schemaThatPreventsDereferencing: {
                    additionalProperties: {
                        $ref: '#/x-circular-schema/schemaThatPreventsDereferencing'
                    },
                    type: 'object'
                }
            });
        const destinationSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({type: 'string'}))
                        .withMediaType('application/xml', openApi3MediaTypeBuilder
                            .withSchemaRef('#/x-circular-schema/schemaThatPreventsDereferencing')))))
            .withTopLevelXProperty('x-circular-schema', {
                schemaThatPreventsDereferencing: {
                    additionalProperties: {
                        $ref: '#/x-circular-schema/schemaThatPreventsDereferencing'
                    },
                    type: 'object'
                }
            });

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect((outcome as DiffOutcomeFailure).breakingDifferences.length).toBe(1);
    });

    it('should convert response body schemas to a valid JSON schema to diff', async () => {
        const spec = createSpecWithResponseBodySchema({
            exclusiveMinimum: true,
            minimum: 0,
            type: 'number'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });
});
