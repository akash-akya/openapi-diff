import {SpecFormat} from '../../lib/api-types';
import {OpenApiDiffErrorImpl} from '../../lib/common/open-api-diff-error-impl';
import {DiffPathsOptions} from '../../lib/openapi-diff';
import {diffOutcomeSuccessBuilder} from '../support/builders/diff-outcome-success-builder';
import {diffPathsOptionsBuilder} from '../support/builders/diff-paths-options-builder';
import {unclassifiedDiffResultBuilder} from '../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/diff-result-spec-entity-details-builder';
import {openApi3ComponentsBuilder} from '../support/builders/openapi3-components-builder';
import {openApi3ContentBuilder} from '../support/builders/openapi3-content-builder';
import {openApi3OperationBuilder} from '../support/builders/openapi3-operation-builder';
import {openApi3PathItemBuilder} from '../support/builders/openapi3-path-item-builder';
import {openApi3RequestBodyBuilder} from '../support/builders/openapi3-request-body-builder';
import {openApi3SpecBuilder} from '../support/builders/openapi3-spec-builder';
import {openapi3SpecsDifferenceBuilder} from '../support/builders/openapi3-specs-difference-builder';
import {specPathOptionBuilder} from '../support/builders/spec-path-option-builder';
import {swagger2SpecBuilder} from '../support/builders/swagger2-spec-builder';
import {expectToFail} from '../support/expect-to-fail';
import {createOpenApiDiffWithMocks} from './support/create-openapi-diff';
import {createMockFileSystem, MockFileSystem} from './support/mocks/mock-file-system';
import {createMockHttpClient, MockHttpClient} from './support/mocks/mock-http-client';
import {createMockResultReporter, MockResultReporter} from './support/mocks/mock-result-reporter';

describe('openapi-diff', () => {
    let mockHttpClient: MockHttpClient;
    let mockFileSystem: MockFileSystem;
    let mockResultReporter: MockResultReporter;

    beforeEach(() => {
        mockHttpClient = createMockHttpClient();
        mockFileSystem = createMockFileSystem();
        mockResultReporter = createMockResultReporter();
    });

    const invokeDiffLocations = (options: DiffPathsOptions): Promise<void> => {
        const openApiDiff = createOpenApiDiffWithMocks({mockFileSystem, mockResultReporter, mockHttpClient});
        return openApiDiff.diffPaths(options);
    };

    describe('content reading', () => {
        it('should call the file system and http client handler with the provided locations', async () => {
            await invokeDiffLocations(
                diffPathsOptionsBuilder
                    .withSourceSpec(specPathOptionBuilder.withLocation('source-spec.json'))
                    .withDestinationSpec(specPathOptionBuilder.withLocation('http://destination.url'))
                    .build()
            );

            expect(mockFileSystem.readFile).toHaveBeenCalledWith('source-spec.json');
            expect(mockHttpClient.get).toHaveBeenCalledWith('http://destination.url');
        });

        it('should report an error when failing to load the source spec from the file system', async () => {
            const openapi3SpecContent = JSON.stringify(openApi3SpecBuilder.build());
            const fileSystemError = new Error('Failed to load file');
            mockFileSystem.givenReadFileReturns(
                Promise.reject(fileSystemError),
                Promise.resolve(openapi3SpecContent)
            );

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(specPathOptionBuilder.withLocation('source-spec.json'))
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(
                new OpenApiDiffErrorImpl(
                    'OPENAPI_DIFF_READ_ERROR',
                    'Unable to read "source-spec.json": Failed to load file'
                )
            );
        });

        it('should report an error when failing to load the destination spec from the file system', async () => {
            const openapi3SpecContent = JSON.stringify(openApi3SpecBuilder.build());
            const fileSystemError = new Error('Failed to load file');
            mockFileSystem.givenReadFileReturns(
                Promise.resolve(openapi3SpecContent),
                Promise.reject(fileSystemError)
            );

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withDestinationSpec(specPathOptionBuilder.withLocation('destination-spec.json'))
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(
                new OpenApiDiffErrorImpl(
                    'OPENAPI_DIFF_READ_ERROR',
                    'Unable to read "destination-spec.json": Failed to load file'
                )
            );
        });

        it('should report an error when the http client returns an error', async () => {
            mockHttpClient.givenGetFailsWith(new Error('test http client error'));

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(specPathOptionBuilder.withLocation('http://url.that.errors.out'))
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_READ_ERROR',
                'Unable to load "http://url.that.errors.out": test http client error'
            ));
        });
    });

    describe('content parsing', () => {
        it('should report an error when unable to parse spec contents', async () => {
            const malformedFileContents: string = '{this is not json or yaml';
            mockFileSystem.givenReadFileReturnsContent(malformedFileContents);

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(specPathOptionBuilder.withLocation('source-spec-invalid.json'))
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(
                new OpenApiDiffErrorImpl(
                    'OPENAPI_DIFF_PARSE_ERROR',
                    'Unable to parse "source-spec-invalid.json" as a JSON or YAML file'
                )
            );
        });

        it('should load the specs as yaml if content is yaml but not json', async () => {
            const openapi3YamlSpec = '' +
                'info: \n' +
                '  title: spec title\n' +
                '  version: spec version\n' +
                'paths: {}\n' +
                'openapi: "3.0.0"\n';

            mockFileSystem.givenReadFileReturnsContent(openapi3YamlSpec);

            await invokeDiffLocations(diffPathsOptionsBuilder.build());

            expect(mockResultReporter.reportError).not.toHaveBeenCalled();
        });

        it('should report an error when openapi3 spec is invalid', async () => {
            const invalidOpenApi3Spec = JSON.stringify({
                openapi: '3.0.0'
            });
            mockFileSystem.givenReadFileReturnsContent(invalidOpenApi3Spec);

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(specPathOptionBuilder.withLocation('source-spec-invalid.json'))
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_PARSE_ERROR',
                'Validation errors in "source-spec-invalid.json": [object Object] is not a valid Openapi API definition'
            ));
        });

        it('should report an error when given format is openapi3 but content is not', async () => {
            const specContent = JSON.stringify({
                openapi: '30.4.1'
            });

            mockFileSystem.givenReadFileReturnsContent(specContent);

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(
                    specPathOptionBuilder
                        .withLocation('source-spec.json')
                        .withFormat('openapi3')
                )
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_PARSE_ERROR',
                '"source-spec.json" is not a "openapi3" spec'
            ));
        });

        it('should successfully parse when spec content is openapi3 and given format is openapi3', async () => {
            const openApi3Content = JSON.stringify(openApi3SpecBuilder.build());
            mockFileSystem.givenReadFileReturnsContent(openApi3Content);

            await invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(
                    specPathOptionBuilder
                        .withLocation('source-spec.json')
                        .withFormat('openapi3')
                )
                .build()
            );

            expect(mockResultReporter.reportError).not.toHaveBeenCalled();
        });

        it('should report an error when given spec format is unknown', async () => {
            const openApi3Content = JSON.stringify(openApi3SpecBuilder.build());
            mockFileSystem.givenReadFileReturnsContent(openApi3Content);

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(
                    specPathOptionBuilder
                        .withLocation('source-spec.json')
                        .withFormat('unknown-format' as SpecFormat)
                )
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_PARSE_ERROR',
                '"source-spec.json" format "unknown-format" is not supported'
            ));
        });

        it('should fail when request body schema contains circular references', async () => {
            const spec = openApi3SpecBuilder
                .withComponents(openApi3ComponentsBuilder
                    .withSchema('stringSchema',
                        {
                            additionalProperties: {$ref: '#/components/schemas/stringSchema'},
                            type: 'object'
                        }))
                .withPath('/some/path', openApi3PathItemBuilder
                    .withOperation('post', openApi3OperationBuilder
                        .withRequestBody(openApi3RequestBodyBuilder
                            .withContent(openApi3ContentBuilder
                                .withSchemaRef('#/components/schemas/stringSchema')))));

            mockFileSystem.givenReadFileReturnsContent(JSON.stringify(spec.build()));

            await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(specPathOptionBuilder.withLocation('source-spec-with-circular-refs.json'))
                .build()
            ));

            expect(mockResultReporter.reportError).toHaveBeenCalledWith(new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_PARSE_ERROR',
                'Validation errors in "source-spec-with-circular-refs.json": The API contains circular references'
            ));
        });
    });

    describe('spec diffing', () => {
        it('should report the diff outcome when diffing is successfully executed', async () => {
            const openapi3SpecContent = JSON.stringify(openApi3SpecBuilder.build());
            mockFileSystem.givenReadFileReturnsContent(openapi3SpecContent);

            await invokeDiffLocations(diffPathsOptionsBuilder.build());

            expect(mockResultReporter.reportOutcome).toHaveBeenCalledWith(
                diffOutcomeSuccessBuilder
                    .withNonBreakingDifferences([])
                    .withUnclassifiedDifferences([])
                    .build()
            );
        });

        it('should return a rejected promise when breaking differences have been found', async () => {
            const {source, destination} = openapi3SpecsDifferenceBuilder
                .withBreakingDifference()
                .build();

            const sourceSpecContent = JSON.stringify(source.build());
            const destinationSpecContent = JSON.stringify(destination.build());

            mockFileSystem.givenReadFileReturns(
                Promise.resolve(sourceSpecContent),
                Promise.resolve(destinationSpecContent)
            );

            const error = await expectToFail(invokeDiffLocations(diffPathsOptionsBuilder.build()));
            expect(error.message).toEqual('Breaking differences found');
        });

        it('should allow diffing swagger2 against an openapi3 with format auto-detect', async () => {
            const openapi3SpecContent = JSON.stringify(
                openApi3SpecBuilder
                    .withTopLevelXProperty('x-some-value', 'OLD')
                    .build()
            );
            const swagger2SpecContent = JSON.stringify(
                swagger2SpecBuilder
                    .withTopLevelXProperty('x-some-value', 'NEW')
                    .build()
            );

            mockFileSystem.givenReadFileReturns(
                Promise.resolve(openapi3SpecContent),
                Promise.resolve(swagger2SpecContent)
            );
            await invokeDiffLocations(diffPathsOptionsBuilder
                .withSourceSpec(specPathOptionBuilder.withFormat('auto-detect'))
                .withDestinationSpec(specPathOptionBuilder.withFormat('auto-detect'))
                .build());

            const baseDifference = unclassifiedDiffResultBuilder
                .withEntity('unclassified')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation('x-some-value')
                        .withValue('OLD')
                ])
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation('x-some-value')
                        .withValue('NEW')
                ]);

            expect(mockResultReporter.reportOutcome).toHaveBeenCalledWith(
                diffOutcomeSuccessBuilder
                    .withNonBreakingDifferences([])
                    .withUnclassifiedDifferences([
                        baseDifference.withAction('add').withCode('unclassified.add'),
                        baseDifference.withAction('remove').withCode('unclassified.remove')
                    ])
                    .build()
            );
        });
    });
});
