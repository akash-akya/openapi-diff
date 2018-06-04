import {OpenApiDiff} from '../../lib/openapi-diff';
import {ContentLoader} from '../../lib/openapi-diff/content-loader';
import {expectToFail} from '../support/expect-to-fail';
import {diffOutcomeSuccessBuilder} from './support/builders/diff-outcome-success-builder';
import {specDetailsBuilder} from './support/builders/spec-details-builder';
import {swagger2SpecBuilder} from './support/builders/swagger-2-spec-builder';
import {swagger2SpecsDifferenceBuilder} from './support/builders/swagger2-specs-difference-builder';
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

    const invokeDiffLocations = (sourceSpecPath: string, destinationSpecPath: string): Promise<void> => {
        const contentLoader = new ContentLoader(mockHttpClient, mockFileSystem);
        const openApiDiff = new OpenApiDiff(contentLoader, mockResultReporter);
        return openApiDiff.diffPaths(sourceSpecPath, destinationSpecPath);
    };

    it('should load the source spec from the file system', async () => {
        await invokeDiffLocations('source-spec.json', 'destination-spec.json');

        expect(mockFileSystem.readFile).toHaveBeenCalledWith('source-spec.json');
    });

    it('should load the destination spec from the file system', async () => {
        await invokeDiffLocations('source-spec.json', 'destination-spec.json');

        expect(mockFileSystem.readFile).toHaveBeenCalledWith('destination-spec.json');
    });

    it('should report an error when failing to load the source spec from the file system', async () => {
        const swaggerSpecContent = JSON.stringify(swagger2SpecBuilder.build());
        mockFileSystem.givenReadFileReturns(
            Promise.reject(new Error('spec-loader-error')),
            Promise.resolve(swaggerSpecContent)
        );

        await expectToFail(invokeDiffLocations('source-spec.json', 'destination-spec.json'));

        expect(mockResultReporter.reportError).toHaveBeenCalledWith(new Error('spec-loader-error'));
    });

    it('should report an error when failing to load the destination spec from the file system', async () => {
        const swaggerSpecContent = JSON.stringify(swagger2SpecBuilder.build());
        mockFileSystem.givenReadFileReturns(
            Promise.resolve(swaggerSpecContent),
            Promise.reject(new Error('spec-loader-error'))
        );

        await expectToFail(invokeDiffLocations('source-spec.json', 'destination-spec.json'));

        expect(mockResultReporter.reportError).toHaveBeenCalledWith(new Error('spec-loader-error'));
    });

    it('should report an error when unable to parse spec contents', async () => {
        const malformedFileContents: string = '{this is not json or yaml';
        mockFileSystem.givenReadFileReturnsContent(malformedFileContents);

        await expectToFail(invokeDiffLocations('source-spec-invalid.json', 'destination-spec.json'));

        expect(mockResultReporter.reportError).toHaveBeenCalledWith(
            new Error('ERROR: unable to parse source-spec-invalid.json as a JSON or YAML file')
        );
    });

    it('should report the diff outcome when diffing is successfully executed', async () => {
        const swaggerSpecContent = JSON.stringify(swagger2SpecBuilder.build());
        mockFileSystem.givenReadFileReturns(
            Promise.resolve(swaggerSpecContent),
            Promise.resolve(swaggerSpecContent)
        );
        await invokeDiffLocations('source-spec.json', 'destination-spec.json');

        expect(mockResultReporter.reportOutcome).toHaveBeenCalledWith(
            diffOutcomeSuccessBuilder
                .withNonBreakingDifferences([])
                .withUnclassifiedDifferences([])
                .withSourceSpecDetails(
                    specDetailsBuilder.withFormat('swagger2').withLocation('source-spec.json'))
                .withDestinationSpecDetails(
                    specDetailsBuilder.withFormat('swagger2').withLocation('destination-spec.json'))
                .build()
        );
    });

    it('should return a rejected promise when breaking differences have been found', async () => {
        const {source, destination} = swagger2SpecsDifferenceBuilder
            .withBreakingDifference()
            .build();

        const sourceSpecContent = JSON.stringify(source.build());
        const destinationSpecContent = JSON.stringify(destination.build());

        mockFileSystem.givenReadFileReturns(
            Promise.resolve(sourceSpecContent),
            Promise.resolve(destinationSpecContent)
        );

        const error = await expectToFail(invokeDiffLocations('source-spec.json', 'destination-spec.json'));
        expect(error.message).toEqual('Breaking differences found');
    });
});
