import {DiffOutcomeFailure, OpenApiDiffError} from '../../../lib/api-types';
import {OpenApiDiffErrorImpl} from '../../../lib/common/open-api-diff-error-impl';
import {DiffPathsOptions} from '../../../lib/openapi-diff';
import {Swagger2Schema} from '../../../lib/openapi-diff/swagger2';
import {diffPathsOptionsBuilder} from '../../support/builders/diff-paths-options-builder';
import {
    breakingDiffResultBuilder,
    nonBreakingDiffResultBuilder,
    unclassifiedDiffResultBuilder
} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {refObjectBuilder} from '../../support/builders/ref-object-builder';
import {specPathOptionBuilder} from '../../support/builders/spec-path-option-builder';
import {swagger2BodyParameterBuilder} from '../../support/builders/swagger2-body-parameter-builder';
import {swagger2OperationBuilder} from '../../support/builders/swagger2-operation-builder';
import {swagger2PathItemBuilder} from '../../support/builders/swagger2-path-item-builder';
import {swagger2ResponseBuilder} from '../../support/builders/swagger2-response-builder';
import {swagger2ResponseHeaderBuilder} from '../../support/builders/swagger2-response-header-builder';
import {Swagger2SpecBuilder, swagger2SpecBuilder} from '../../support/builders/swagger2-spec-builder';
import {expectToFail} from '../../support/expect-to-fail';
import {createOpenApiDiffWithMocks} from '../support/create-openapi-diff';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {createMockFileSystem, MockFileSystem} from '../support/mocks/mock-file-system';
import {createMockHttpClient, MockHttpClient} from '../support/mocks/mock-http-client';
import {createMockResultReporter, MockResultReporter} from '../support/mocks/mock-result-reporter';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('openapi-diff swagger2', () => {
    let mockHttpClient: MockHttpClient;
    let mockFileSystem: MockFileSystem;
    let mockResultReporter: MockResultReporter;

    beforeEach(() => {
        mockHttpClient = createMockHttpClient();
        mockFileSystem = createMockFileSystem();
        mockResultReporter = createMockResultReporter();
    });

    const defaultPath = '/some/path';
    const defaultMethod = 'post';
    const defaultStatusCode = '200';

    const invokeDiffLocations = (options: DiffPathsOptions): Promise<void> => {
        const openApiDiff = createOpenApiDiffWithMocks({mockFileSystem, mockResultReporter, mockHttpClient});
        return openApiDiff.diffPaths(options);
    };

    const createSpecWithRequestBodySchema = (schema: Swagger2Schema): Swagger2SpecBuilder => {
        return swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withParameters([swagger2BodyParameterBuilder
                        .withSchema(schema)
                    ])));
    };

    const createSpecWithResponseBodySchema = (schema: Swagger2Schema): Swagger2SpecBuilder => {
        return swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, swagger2ResponseBuilder
                        .withResponseBody(schema)
                    )));
    };

    describe('content parsing', () => {
        it('should report an error when the swagger 2 file is not valid', async () => {
            const invalidSwagger2Spec = '{"swagger": "2.0"}';
            mockFileSystem.givenReadFileReturnsContent(invalidSwagger2Spec);

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(specPathOptionBuilder.withLocation('source-spec-invalid.json'))
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_PARSE_ERROR',
                'Validation errors in "source-spec-invalid.json": [object Object] is not a valid Swagger API definition'
            ));
        });

        it('should report an error when format is swagger2 but content is not', async () => {
            const specContent = JSON.stringify({openapi: '3.0.0'});

            mockFileSystem.givenReadFileReturnsContent(specContent);

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(
                    specPathOptionBuilder
                        .withLocation('source-spec.json')
                        .withFormat('swagger2')
                )
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_PARSE_ERROR',
                '"source-spec.json" is not a "swagger2" spec'
            ));
        });

        it('should successfully parse when spec content is swagger2 and given format is swagger2', async () => {
            const swagger2Content = swagger2SpecBuilder.build();

            mockFileSystem.givenReadFileReturns(
                Promise.resolve(JSON.stringify(swagger2Content)),
                Promise.resolve(JSON.stringify(swagger2Content))
            );

            await invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(
                    specPathOptionBuilder
                        .withLocation('source-spec.json')
                        .withFormat('swagger2')
                )
                .build()
            );

            expect(mockResultReporter.reportError).not.toHaveBeenCalled();
        });
    });

    it('should report an add and remove differences, when a method was changed', async () => {
        const sourceSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation('get', swagger2OperationBuilder)
            );
        const destinationSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder)
            );

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            nonBreakingDiffResultBuilder
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation(`paths.${defaultPath}.${defaultMethod}`)
                        .withValue(swagger2OperationBuilder.build())
                ])
                .withSourceSpecEntityDetails([])
                .withCode('method.add')
                .withSource('openapi-diff')
                .withEntity('method')
                .withAction('add')
                .build(),

            breakingDiffResultBuilder
                .withDestinationSpecEntityDetails([])
                .withSourceSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation(`paths.${defaultPath}.get`)
                        .withValue(swagger2OperationBuilder.build())
                ])
                .withCode('method.remove')
                .withSource('openapi-diff')
                .withEntity('method')
                .withAction('remove')
                .build()
        ]);
    });

    it('should return unclassified add and remove differences, when an x-property is changed', async () => {
        const sourceSpec = swagger2SpecBuilder
            .withTopLevelXProperty('x-external-id', 'x value');
        const destinationSpec = swagger2SpecBuilder
            .withTopLevelXProperty('x-external-id', 'NEW x value');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const baseDiffResult = unclassifiedDiffResultBuilder
            .withSource('openapi-diff')
            .withEntity('unclassified')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation('x-external-id')
                    .withValue('x value')
            ])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation('x-external-id')
                    .withValue('NEW x value')
            ]);

        expect(outcome).toContainDifferences([
            baseDiffResult.withAction('add').withCode('unclassified.add').build(),
            baseDiffResult.withAction('remove').withCode('unclassified.remove').build()
        ]);
    });

    it('should return an add and remove difference, when a path is changed', async () => {
        const removedPath = '/some/oldPath';
        const addedPath = '/some/newPath';

        const sourceSpec = swagger2SpecBuilder
            .withPath(removedPath, swagger2PathItemBuilder);

        const destinationSpec = swagger2SpecBuilder
            .withPath(addedPath, swagger2PathItemBuilder);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            nonBreakingDiffResultBuilder
                .withAction('add')
                .withCode('path.add')
                .withEntity('path')
                .withSource('openapi-diff')
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation(`paths.${addedPath}`)
                        .withValue(swagger2PathItemBuilder.build())
                ])
                .withSourceSpecEntityDetails([])
                .build(),
            breakingDiffResultBuilder
                .withAction('remove')
                .withCode('path.remove')
                .withEntity('path')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation(`paths.${removedPath}`)
                        .withValue(swagger2PathItemBuilder.build())
                ])
                .withDestinationSpecEntityDetails([])
                .build()
        ]);
    });

    it('should return breaking differences when a request body parameter was not there and is added', async () => {
        const sourceSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder));
        const destinationSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withParameters([swagger2BodyParameterBuilder.withSchema({type: 'string'})])));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const typeChangeLocation = `paths.${defaultPath}.${defaultMethod}.parameters.0.schema.type`;
        const baseBreakingDifference = breakingDiffResultBuilder
            .withAction('remove')
            .withCode('request.body.scope.remove')
            .withEntity('request.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(typeChangeLocation)
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
        const sourceSpec = swagger2SpecBuilder
            .withDefinition('stringSchema', {type: 'string'})
            .withDefinition('requestBodySchema', {$ref: '#/definitions/stringSchema'})
            .withParameter(
                'RequestBody',
                swagger2BodyParameterBuilder.withSchema({$ref: '#/definitions/requestBodySchema'})
            )
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withParameters([refObjectBuilder.withRef('#/parameters/RequestBody')])));

        const destinationSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withParameters([swagger2BodyParameterBuilder.withSchema({type: 'number'})])));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const typeChangeLocation = `paths.${defaultPath}.${defaultMethod}.parameters.0.schema.type`;
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

    it('should handle the case of a circular request bodyParameter schema', async () => {
        const specWithSchemaCircles = swagger2SpecBuilder
            .withDefinition('circularSchema',
                {
                    additionalProperties: {$ref: '#/definitions/circularSchema'},
                    type: 'object'
                })
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withParameters([
                        swagger2BodyParameterBuilder.withSchema({$ref: '#/definitions/circularSchema'})
                    ])));

        const error = await expectToFail(whenSpecsAreDiffed(specWithSchemaCircles, specWithSchemaCircles));

        expect(error.message).toContain('Circular $ref pointer found');
        expect((error as OpenApiDiffError).code).toEqual('OPENAPI_DIFF_DIFF_ERROR');
    });

    it('should return add and remove differences, when response status codes are added and removed', async () => {
        const sourceSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, swagger2ResponseBuilder)
                    .withResponse('202', swagger2ResponseBuilder)));
        const destinationSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, swagger2ResponseBuilder)
                    .withResponse('201', swagger2ResponseBuilder)));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            nonBreakingDiffResultBuilder
                .withAction('add')
                .withCode('response.status-code.add')
                .withEntity('response.status-code')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails([])
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation('paths./some/path.post.responses.201')
                        .withValue(swagger2ResponseBuilder.build())
                ])
                .build(),
            breakingDiffResultBuilder
                .withAction('remove')
                .withCode('response.status-code.remove')
                .withEntity('response.status-code')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation('paths./some/path.post.responses.202')
                        .withValue(swagger2ResponseBuilder.build())
                ])
                .withDestinationSpecEntityDetails([])
                .build()
        ]);
    });

    it('should return non-breaking differences if a response schema was not there and is added', async () => {
        const sourceSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, swagger2ResponseBuilder)));
        const destinationSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, swagger2ResponseBuilder
                        .withResponseBody({type: 'string'}))));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const typeChangeLocation = `paths.${defaultPath}.${defaultMethod}.responses.${defaultStatusCode}.schema.type`;
        const baseNonBreakingDifference = nonBreakingDiffResultBuilder
            .withAction('remove')
            .withCode('response.body.scope.remove')
            .withEntity('response.body.scope')
            .withSource('json-schema-diff')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(typeChangeLocation)
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
        const sourceSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, swagger2ResponseBuilder
                        .withResponseBody({type: 'string'}))));
        const destinationSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, swagger2ResponseBuilder
                        .withResponseBody({type: 'number'}))));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const typeChangeLocation = `paths.${defaultPath}.${defaultMethod}.responses.${defaultStatusCode}.schema.type`;
        const nonBreakingDifference = nonBreakingDiffResultBuilder
            .withAction('remove')
            .withCode('response.body.scope.remove')
            .withDetails({value: 'string'})
            .withEntity('response.body.scope')
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
            .build();

        const breakingDifference = breakingDiffResultBuilder
            .withAction('add')
            .withCode('response.body.scope.add')
            .withDetails({value: 'number'})
            .withEntity('response.body.scope')
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
            .build();

        expect(outcome).toContainDifferences([nonBreakingDifference, breakingDifference]);
    });

    it('should find differences in response bodies with references', async () => {
        const sourceSpec = swagger2SpecBuilder
            .withDefinition('stringSchema', {type: 'string'})
            .withResponse('aResponse', swagger2ResponseBuilder
                .withSchemaRef('#/definitions/stringSchema'))
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, refObjectBuilder
                        .withRef('#/responses/aResponse'))));
        const destinationSpec = swagger2SpecBuilder
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, swagger2ResponseBuilder
                        .withResponseBody({type: 'number'}))));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome.nonBreakingDifferences.length).toBe(1);
        expect((outcome as DiffOutcomeFailure).breakingDifferences.length).toBe(1);
    });

    it('should handle the case of a circular response body schema', async () => {
        const specWithSchemaCircles = swagger2SpecBuilder
            .withDefinition('stringSchema',
                {
                    additionalProperties: {$ref: '#/definitions/stringSchema'},
                    type: 'object'
                })
            .withResponse('responseReference', swagger2ResponseBuilder
                .withSchemaRef('#/definitions/stringSchema'))
            .withPath(defaultPath, swagger2PathItemBuilder
                .withOperation(defaultMethod, swagger2OperationBuilder
                    .withResponse(defaultStatusCode, refObjectBuilder
                        .withRef('#/responses/responseReference'))));

        const error = await expectToFail(whenSpecsAreDiffed(specWithSchemaCircles, specWithSchemaCircles));

        expect(error.message).toContain('Circular $ref pointer found');
        expect((error as OpenApiDiffError).code).toEqual('OPENAPI_DIFF_DIFF_ERROR');
    });

    it('should convert swagger2 request body schemas to a valid JSON schema to diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            exclusiveMinimum: true,
            minimum: 0,
            type: 'number'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    // Can't be properly tested until json-schema-diff can detect differences in array schemas
    it('should convert requestBodies with incompatible items array to a valid schema by json-schema-diff', async () => {
        const spec = createSpecWithRequestBodySchema({
            items: [{
                exclusiveMinimum: true,
                type: 'number'
            }],
            type: 'array'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    it('should convert swagger2 response body schemas to a valid JSON schema to diff', async () => {
        const spec = createSpecWithResponseBodySchema({
            exclusiveMinimum: true,
            minimum: 0,
            type: 'number'
        });

        const outcome = await whenSpecsAreDiffed(spec, spec);

        expect(outcome).toContainDifferences([]);
    });

    describe('response headers', () => {
        const createSpecWithHeader = (responseHeaderName: string): Swagger2SpecBuilder => {
            return swagger2SpecBuilder
                .withPath(defaultPath, swagger2PathItemBuilder
                    .withOperation(defaultMethod, swagger2OperationBuilder
                        .withResponse(defaultStatusCode, swagger2ResponseBuilder
                            .withHeader(responseHeaderName, swagger2ResponseHeaderBuilder))));
        };

        it('should return add/remove differences for required headers, when these are added and removed', async () => {
            const sourceSpec = createSpecWithHeader('x-some-header');
            const destinationSpec = createSpecWithHeader('x-another-header');

            const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

            expect(outcome).toContainDifferences([
                nonBreakingDiffResultBuilder
                    .withAction('add')
                    .withCode('response.required.header.add')
                    .withEntity('response.required.header')
                    .withSource('openapi-diff')
                    .withSourceSpecEntityDetails([])
                    .withDestinationSpecEntityDetails([
                        specEntityDetailsBuilder
                            .withLocation('paths./some/path.post.responses.200.headers.x-another-header')
                            .withValue(swagger2ResponseHeaderBuilder.build())
                    ])
                    .build(),
                breakingDiffResultBuilder
                    .withAction('remove')
                    .withCode('response.required.header.remove')
                    .withEntity('response.required.header')
                    .withSource('openapi-diff')
                    .withSourceSpecEntityDetails([
                        specEntityDetailsBuilder
                            .withLocation('paths./some/path.post.responses.200.headers.x-some-header')
                            .withValue(swagger2ResponseHeaderBuilder.build())
                    ])
                    .withDestinationSpecEntityDetails([])
                    .build()
            ]);
        });
    });
});
