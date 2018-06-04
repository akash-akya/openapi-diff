import {ContentLoader} from '../../../lib/openapi-diff/content-loader';
import {expectToFail} from '../../support/expect-to-fail';
import {createMockFileSystem, MockFileSystem} from '../support/mocks/mock-file-system';
import {createMockHttpClient, MockHttpClient} from '../support/mocks/mock-http-client';

describe('contentLoader', () => {
    let mockHttpClient: MockHttpClient;
    let mockFileSystem: MockFileSystem;

    beforeEach(() => {
        mockFileSystem = createMockFileSystem();
        mockFileSystem.givenReadFileReturnsContent('{}');
        mockHttpClient = createMockHttpClient();
        mockHttpClient.givenGetReturns('{}');
    });

    const invokeLoad = (location: string): Promise<string> => {
        const specLoader = new ContentLoader(mockHttpClient, mockFileSystem);
        return specLoader.load(location);
    };

    describe('when the input location is a file', () => {
        it('should call the file system handler with the provided location', async () => {
            await invokeLoad('input-file.json');

            expect(mockFileSystem.readFile).toHaveBeenCalledWith('input-file.json');
        });

        it('should error out when the file system returns an error', async () => {
            mockFileSystem.givenReadFileFailsWith(new Error('test file system error'));

            const error = await expectToFail(invokeLoad('non-existing-file.json'));

            expect(error.message).toEqual(jasmine.stringMatching('test file system error'));
        });

        it('should return the file contents when able to read the file', async () => {
            const fileContents: string = 'file contents';
            mockFileSystem.givenReadFileReturnsContent(fileContents);

            const results = await invokeLoad('ok-file.json');

            expect(results).toEqual(fileContents);
        });
    });

    describe('when the input location is a URL', () => {
        it('should call the http client handler with the provided location', async () => {
            await invokeLoad('http://input.url');

            expect(mockHttpClient.get).toHaveBeenCalledWith('http://input.url');
        });

        it('should error out when the http client returns an error', async () => {
            mockHttpClient.givenGetFailsWith(new Error('test http client error'));

            const error = await expectToFail(invokeLoad('http://url.that.errors.out'));

            expect(error.message).toEqual(jasmine.stringMatching('test http client error'));
        });

        it('should return the url contents when able to open the url', async () => {
            const urlContents: string = 'url contents';
            mockHttpClient.givenGetReturns(urlContents);

            const results = await invokeLoad('http://url.that.works');

            expect(results).toEqual(urlContents);
        });
    });
});
