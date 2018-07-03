import {OpenApiDiff} from '../../../lib/openapi-diff';
import {ContentLoader} from '../../../lib/openapi-diff/content-loader';
import {createMockFileSystem, MockFileSystem} from './mocks/mock-file-system';
import {createMockHttpClient, MockHttpClient} from './mocks/mock-http-client';
import {createMockResultReporter, MockResultReporter} from './mocks/mock-result-reporter';

interface CreateOpenApiDiffMocks {
   mockHttpClient: MockHttpClient;
   mockFileSystem: MockFileSystem;
   mockResultReporter: MockResultReporter;
}

export const createOpenApiDiffWithMocks = (mocks: CreateOpenApiDiffMocks): OpenApiDiff => {
    const contentLoader = new ContentLoader(mocks.mockHttpClient, mocks.mockFileSystem);
    return new OpenApiDiff(contentLoader, mocks.mockResultReporter);
};

export const createOpenApiDiff = (): OpenApiDiff =>
    createOpenApiDiffWithMocks({
        mockFileSystem: createMockFileSystem(),
        mockHttpClient: createMockHttpClient(),
        mockResultReporter: createMockResultReporter()
    });
