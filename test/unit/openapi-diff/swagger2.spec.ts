import {OpenApiDiffErrorImpl} from '../../../lib/common/open-api-diff-error-impl';
import {
    breakingDiffResultBuilder,
    nonBreakingDiffResultBuilder,
    unclassifiedDiffResultBuilder
} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
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
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('paths./path.post')
                        .withValue(swagger2OperationBuilder.build())
                )
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined)
                )
                .withCode('method.add')
                .withSource('openapi-diff')
                .withEntity('method')
                .withAction('add')
                .build(),

            breakingDiffResultBuilder
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined)
                )
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('paths./path.get')
                        .withValue(swagger2OperationBuilder.build())
                )
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
            .withSourceSpecEntityDetails(
                specEntityDetailsBuilder
                    .withLocation('x-external-id')
                    .withValue('x value'))
            .withDestinationSpecEntityDetails(
                specEntityDetailsBuilder
                    .withLocation('x-external-id')
                    .withValue('NEW x value'));

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
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(`paths.${addedPath}`)
                    .withValue(swagger2PathItemBuilder.build()))
                .withSourceSpecEntityDetails(specEntityDetailsBuilder.withLocation(undefined).withValue(undefined))
                .build(),
            breakingDiffResultBuilder
                .withAction('remove')
                .withCode('path.remove')
                .withEntity('path')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(`paths.${removedPath}`)
                    .withValue(swagger2PathItemBuilder.build()))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder.withLocation(undefined).withValue(undefined))
                .build()
        ]);
    });
});
