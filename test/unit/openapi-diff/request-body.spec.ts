import {DiffOutcomeFailure, OpenApiDiffError} from '../../../lib/api-types';
import {OpenApi3Schema} from '../../../lib/openapi-diff/openapi3';
import {breakingDiffResultBuilder, nonBreakingDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openApi3ComponentsBuilder} from '../../support/builders/openapi3-components-builder';
import {openApi3MediaTypeBuilder} from '../../support/builders/openapi3-media-type-builder';
import {openApi3OperationBuilder} from '../../support/builders/openapi3-operation-builder';
import {openApi3PathItemBuilder} from '../../support/builders/openapi3-path-item-builder';
import {openApi3RequestBodyBuilder} from '../../support/builders/openapi3-request-body-builder';
import {OpenApi3SpecBuilder, openApi3SpecBuilder} from '../../support/builders/openapi3-spec-builder';
import {refObjectBuilder} from '../../support/builders/ref-object-builder';
import {expectToFail} from '../../support/expect-to-fail';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('openapi-diff request-body', () => {
    const defaultPath = '/some/path';
    const defaultMethod = 'post';
    const defaultMediaType = 'application/json';

    const defaultTypeChangeLocation =
        `paths.${defaultPath}.${defaultMethod}.requestBody.content.${defaultMediaType}.schema.type`;

    const createSpecWithNoRequestBody = () => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder));
    };

    const createSpecWithRequestBodyWithoutSchema = () => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder))));
    };

    const createSpecWithRequestBodySchema = (schema: OpenApi3Schema): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema(schema)))));
    };

    const createSpecWithRequestBodySchemaType = (type: 'string' | 'number') =>
        createSpecWithRequestBodySchema({type});

    it('should return no differences for the same spec', async () => {
        const aSpec = createSpecWithRequestBodySchemaType('string');

        const outcome = await whenSpecsAreDiffed(aSpec, aSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should return a breaking and non-breaking differences if request schema scope is changed', async () => {
        const sourceSpec = createSpecWithRequestBodySchemaType('string');
        const destinationSpec = createSpecWithRequestBodySchemaType('number');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            nonBreakingDiffResultBuilder
                .withAction('add')
                .withCode('request.body.scope.add')
                .withEntity('request.body.scope')
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
                .withDetails({value: 'number'})
                .build(),
            breakingDiffResultBuilder
                .withAction('remove')
                .withCode('request.body.scope.remove')
                .withEntity('request.body.scope')
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
                .withDetails({value: 'string'})
                .build()
        ]);
    });

    it('should find differences for request bodies in all operations', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation('put', openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({type: 'string'}))))
                .withOperation('post', openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({type: 'string'})))));
        const destinationSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation('put', openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({type: 'number'}))))
                .withOperation('post', openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({type: 'number'})))));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome.nonBreakingDifferences.length).toBe(2, 'find differences in all operations of a path');
    });

    it('should return breaking differences, when a request body was added', async () => {
        const sourceSpec = createSpecWithNoRequestBody();
        const destinationSpec = createSpecWithRequestBodySchemaType('string');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const baseBreakingDifference = breakingDiffResultBuilder
            .withAction('remove')
            .withCode('request.body.scope.remove')
            .withEntity('request.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
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

    it('should return non-breaking differences, when a request body was removed', async () => {
        const sourceSpec = createSpecWithRequestBodySchemaType('string');
        const destinationSpec = createSpecWithNoRequestBody();

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const baseNonBreakingDifference = nonBreakingDiffResultBuilder
            .withAction('add')
            .withCode('request.body.scope.add')
            .withEntity('request.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
                    .withValue('string')
            ])
            .withDestinationSpecEntityDetails([]);
        expect(outcome).toContainDifferences([
            baseNonBreakingDifference.withDetails({value: 'boolean'}).build(),
            baseNonBreakingDifference.withDetails({value: 'object'}).build(),
            baseNonBreakingDifference.withDetails({value: 'integer'}).build(),
            baseNonBreakingDifference.withDetails({value: 'number'}).build(),
            baseNonBreakingDifference.withDetails({value: 'array'}).build(),
            baseNonBreakingDifference.withDetails({value: 'null'}).build()
        ]);
    });

    it('should return breaking differences, when a schema was added onto a request body', async () => {
        const sourceSpec = createSpecWithRequestBodyWithoutSchema();
        const destinationSpec = createSpecWithRequestBodySchemaType('string');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const baseBreakingDifference = breakingDiffResultBuilder
            .withAction('remove')
            .withCode('request.body.scope.remove')
            .withEntity('request.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
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

    it('should return non-breaking differences, when the schema was removed from a request body', async () => {
        const sourceSpec = createSpecWithRequestBodySchemaType('string');
        const destinationSpec = createSpecWithRequestBodyWithoutSchema();

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const baseNonBreakingDifference = nonBreakingDiffResultBuilder
            .withAction('add')
            .withCode('request.body.scope.add')
            .withEntity('request.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(defaultTypeChangeLocation)
                    .withValue('string')
            ])
            .withDestinationSpecEntityDetails([]);
        expect(outcome).toContainDifferences([
            baseNonBreakingDifference.withDetails({value: 'boolean'}).build(),
            baseNonBreakingDifference.withDetails({value: 'object'}).build(),
            baseNonBreakingDifference.withDetails({value: 'integer'}).build(),
            baseNonBreakingDifference.withDetails({value: 'number'}).build(),
            baseNonBreakingDifference.withDetails({value: 'array'}).build(),
            baseNonBreakingDifference.withDetails({value: 'null'}).build()
        ]);
    });

    it('should find differences in request bodies with references', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withSchema('stringSchema', {type: 'string'})
                .withSchema('requestBodySchema', {$ref: '#/components/schemas/stringSchema'})
                .withRequestBody(
                    'RequestBody', openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withSchemaRef('#/components/schemas/requestBodySchema'))))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withRequestBody(refObjectBuilder.withRef('#/components/requestBodies/RequestBody'))));
        const destinationSpec = createSpecWithRequestBodySchemaType('number');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome.nonBreakingDifferences.length).toBe(1);
        expect((outcome as DiffOutcomeFailure).breakingDifferences.length).toBe(1);
    });

    it('should handle the case of a circular requestBody schema', async () => {
        const spec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withSchema('stringSchema',
                    {
                        additionalProperties: {$ref: '#/components/schemas/stringSchema'},
                        type: 'object'
                    }))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withSchemaRef('#/components/schemas/stringSchema')))));

        const error = await expectToFail(whenSpecsAreDiffed(spec, spec));

        expect(error.message).toContain('Circular $ref pointer found');
        expect((error as OpenApiDiffError).code).toEqual('OPENAPI_DIFF_DIFF_ERROR');
    });

    it('should handle the case of a circular requestBody schema when requestBody is a reference itself', async () => {
        const spec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withSchema('stringSchema',
                    {
                        additionalProperties: {$ref: '#/components/schemas/stringSchema'},
                        type: 'object'
                    })
                .withRequestBody('requestBodyReference', openApi3RequestBodyBuilder
                    .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                        .withSchemaRef('#/components/schemas/stringSchema'))))
            .withPath('/some/path', openApi3PathItemBuilder
                .withOperation('post', openApi3OperationBuilder
                    .withRequestBody(refObjectBuilder
                        .withRef('#/components/requestBodies/requestBodyReference'))));

        const error = await expectToFail(whenSpecsAreDiffed(spec, spec));

        expect(error.message).toContain('Circular $ref pointer found');
        expect((error as OpenApiDiffError).code).toEqual('OPENAPI_DIFF_DIFF_ERROR');
    });

    it('should handle the case of a circular requestBody schema when requestBody is a deep reference', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withRequestBody('nonCircularReferenceA', refObjectBuilder
                    .withRef('#/components/requestBodies/nonCircularReferenceB'))
                .withRequestBody('nonCircularReferenceB', openApi3RequestBodyBuilder
                    .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                        .withJsonContentSchema({type: 'string'}))
                    .withMediaType('application/xml', openApi3MediaTypeBuilder
                        .withSchemaRef('#/x-circular-schema/schemaThatPreventsDereferencing'))))
            .withPath('/some/path', openApi3PathItemBuilder
                .withOperation('post', openApi3OperationBuilder
                    .withRequestBody(refObjectBuilder
                        .withRef('#/components/requestBodies/nonCircularReferenceA'))))
            .withTopLevelXProperty('x-circular-schema', {
                schemaThatPreventsDereferencing: {
                    additionalProperties: {
                        $ref: '#/x-circular-schema/schemaThatPreventsDereferencing'
                    },
                    type: 'object'
                }
            });
        const destinationSpec = openApi3SpecBuilder
            .withPath('/some/path', openApi3PathItemBuilder
                .withOperation('post', openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({type: 'number'}))
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

    // Can't be properly tested until json-schema-diff can detect differences in number schemas
    it('should convert requestBodies with falsy exclusiveMinimum to a valid JSON schema to diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            exclusiveMinimum: false,
            minimum: 0,
            type: 'number'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    // Can't be properly tested until json-schema-diff can detect differences in number schemas
    it('should convert requestBodies with truthy exclusiveMinimum to a valid JSON schema to diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            exclusiveMinimum: true,
            minimum: 0,
            type: 'number'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    // Can't be properly tested until json-schema-diff can detect differences in number schemas
    it('should convert requestBodies with falsy exclusiveMaximum to a valid JSON schema to diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            exclusiveMaximum: false,
            maximum: 10,
            type: 'number'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    // Can't be properly tested until json-schema-diff can detect differences in number schemas
    it('should convert requestBodies with truthy exclusiveMaximum to a valid JSON schema to diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            exclusiveMaximum: true,
            minimum: 0,
            type: 'number'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    it('should convert schemas with incompatible additionalProperties to a valid JSON schema to diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            additionalProperties: {
                exclusiveMinimum: true,
                type: 'number'
            },
            type: 'object'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    it('should not modify schemas with boolean additionalProperties when sending them to diff', async () => {
        const aSpecWithFalseAdditionalProperties = createSpecWithRequestBodySchema({
            additionalProperties: false,
            type: 'object'
        });

        const aSpecWithTrueAdditionalProperties = createSpecWithRequestBodySchema({
            additionalProperties: true,
            type: 'object'
        });

        const outcome = await whenSpecsAreDiffed(aSpecWithFalseAdditionalProperties, aSpecWithTrueAdditionalProperties);

        expect(outcome.nonBreakingDifferences.length).toBeGreaterThan(0);
    });

    it('should convert schemas with incompatible allOf to a valid JSON schema by json-schema-diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            allOf: [{
                exclusiveMinimum: true,
                type: 'number'
            }]
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    it('should convert schemas with incompatible anyOf to a valid JSON schema by json-schema-diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            anyOf: [{
                exclusiveMinimum: true,
                type: 'number'
            }]
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    it('should convert schemas with incompatible items to a valid JSON schema by json-schema-diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            items: {
                exclusiveMinimum: true,
                type: 'number'
            },
            type: 'array'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    it('should convert schemas with incompatible "not" to a valid JSON schema by json-schema-diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            not: {
                exclusiveMinimum: true,
                type: 'number'
            },
            type: 'object'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    it('should convert schemas with incompatible oneOf to a valid JSON schema by json-schema-diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            oneOf: [{
                exclusiveMinimum: true,
                type: 'number'
            }]
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    it('should convert schemas with incompatible properties to a valid JSON schema by json-schema-diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            properties: {
                property: {
                    exclusiveMinimum: true,
                    type: 'number'
                }
            },
            type: 'object'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    // This test always passes as references are generally dereferenced, and json-schema validation ignores "components"
    it('should convert schemas with incompatible schema reference sources to a valid schema to diff', async () => {
        const spec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withSchema('numberSchema', {
                    exclusiveMaximum: false,
                    maximum: 1,
                    type: 'number'
                }))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withRequestBody(openApi3RequestBodyBuilder
                        .withMediaType(defaultMediaType, openApi3MediaTypeBuilder
                            .withJsonContentSchema({
                                properties: {
                                    numberProperty: {
                                        $ref: '#/components/schemas/numberSchema'
                                    }
                                },
                                type: 'object'
                            })))));

        const outcome =
            await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });
});
