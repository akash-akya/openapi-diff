import {OpenApiDiffErrorImpl} from '../../../lib/common/open-api-diff-error-impl';
import {
    breakingDiffResultBuilder,
    nonBreakingDiffResultBuilder,
    unclassifiedDiffResultBuilder
} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {refObjectBuilder} from '../../support/builders/ref-object-builder';
import {swagger2BodyParameterBuilder} from '../../support/builders/swagger2-body-parameter-builder';
import {swagger2OperationBuilder} from '../../support/builders/swagger2-operation-builder';
import {swagger2PathItemBuilder} from '../../support/builders/swagger2-path-item-builder';
import {swagger2SpecBuilder} from '../../support/builders/swagger2-spec-builder';
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

    const invokeDiffLocations = (sourceSpecPath: string, destinationSpecPath: string): Promise<void> => {
        const openApiDiff = createOpenApiDiffWithMocks({mockFileSystem, mockResultReporter, mockHttpClient});
        return openApiDiff.diffPaths(sourceSpecPath, destinationSpecPath);
    };

    it('should report an error when the swagger 2 file is not valid', async () => {
        const invalidSwagger2Spec = '{"swagger": "2.0"}';
        mockFileSystem.givenReadFileReturnsContent(invalidSwagger2Spec);

        await expectToFail(invokeDiffLocations('source-spec-invalid.json', 'destination-spec.json'));

        expect(mockResultReporter.reportError).toHaveBeenCalledWith(new OpenApiDiffErrorImpl(
            'OPENAPI_DIFF_VALIDATE_SWAGGER_2_ERROR',
            'Validation errors in source-spec-invalid.json',
            new Error('[object Object] is not a valid Swagger API definition')
        ));
    });

    it('should fail when request body parameter contains circular references', async () => {
        const sourceSpec = swagger2SpecBuilder
            .withDefinition('circularSchema',
                    {
                        additionalProperties: {$ref: '#/definitions/circularSchema'},
                        type: 'object'
                    })
            .withPath('/some/path', swagger2PathItemBuilder
                .withOperation('post', swagger2OperationBuilder
                    .withParameters([
                        swagger2BodyParameterBuilder.withSchema({$ref: '#/definitions/circularSchema'})
                    ])));

        mockFileSystem.givenReadFileReturns(
            Promise.resolve(JSON.stringify(sourceSpec.build())),
            Promise.resolve(JSON.stringify(sourceSpec.build()))
        );

        await expectToFail(invokeDiffLocations('source-spec-with-circular-refs.json', 'destination-spec.json'));

        expect(mockResultReporter.reportError).toHaveBeenCalledWith(new OpenApiDiffErrorImpl(
            'OPENAPI_DIFF_VALIDATE_SWAGGER_2_ERROR',
            'Validation errors in source-spec-with-circular-refs.json',
            new Error('The API contains circular references')
        ));
    });

    it('should report an add and remove differences, when a method was changed', async () => {
        const sourceSpec = swagger2SpecBuilder
            .withPath('/path', swagger2PathItemBuilder
                .withOperation('get', swagger2OperationBuilder)
            );
        const destinationSpec = swagger2SpecBuilder
            .withPath('/path', swagger2PathItemBuilder
                .withOperation('post', swagger2OperationBuilder)
            );

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            nonBreakingDiffResultBuilder
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation('paths./path.post')
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
                        .withLocation('paths./path.get')
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

    it('should find differences in request bodies with references', async () => {
        const path = '/some/path';
        const sourceSpec = swagger2SpecBuilder
            .withDefinition('stringSchema', {type: 'string'})
            .withDefinition('requestBodySchema', {$ref: '#/definitions/stringSchema'})
            .withParameter(
                'RequestBody',
                swagger2BodyParameterBuilder.withSchema({$ref: '#/definitions/requestBodySchema'})
            )
            .withPath(path, swagger2PathItemBuilder
                .withOperation('post', swagger2OperationBuilder
                    .withParameters([refObjectBuilder.withRef('#/parameters/RequestBody')])));

        const destinationSpec = swagger2SpecBuilder
            .withPath(path, swagger2PathItemBuilder
                .withOperation('post', swagger2OperationBuilder
                    .withParameters([swagger2BodyParameterBuilder.withSchema({type: 'number'})])));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const typeChangeLocation = `paths.${path}.post.parameters.0.schema.type`;
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
});
