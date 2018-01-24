import {SpecLoader} from '../../../lib/openapi-diff/spec-loader';
import {expectToFail} from '../../support/expect-to-fail';
import {MockCliFactory} from '../support/mock-cli-factory';
import {MockFileSystem} from '../support/mocks/mock-file-system';
import {MockHttpClient} from '../support/mocks/mock-http-client';

describe('specLoader', () => {
    let mockHttpClient: MockHttpClient;
    let mockFileSystem: MockFileSystem;
    let specLoader: SpecLoader;

    beforeEach(() => {
        mockFileSystem = MockCliFactory.createMockFileSystem();
        mockFileSystem.givenReadFileReturns('{}');
        mockHttpClient = MockCliFactory.createMockHttpClient();
        mockHttpClient.givenGetReturns('{}');

        specLoader = new SpecLoader(mockHttpClient, mockFileSystem);
    });

    describe('when the input location is a file', () => {
        it('should call the file system handler with the provided location', async () => {
            await specLoader.load('input-file.json');

            expect(mockFileSystem.readFile).toHaveBeenCalledWith('input-file.json');
        });

        it('should error out when the file system returns an error', async () => {
            mockFileSystem.givenReadFileFailsWith(new Error('test file system error'));

            const error = await expectToFail(specLoader.load('non-existing-file.json'));

            expect(error.message).toEqual(jasmine.stringMatching('test file system error'));
        });

        it('should return the file contents parsed when able to read the file', async () => {
            const fileContents: string = '{ "file": "contents" }';
            mockFileSystem.givenReadFileReturns(fileContents);

            const results = await specLoader.load('ok-file.json');

            expect(results).toEqual(JSON.parse(fileContents));
        });

        it('should error out when unable to parse the file contents as json or yaml', async () => {
            const fileContents: string = '{this is not json or yaml';
            mockFileSystem.givenReadFileReturns(fileContents);

            const error = await expectToFail(specLoader.load('existing-file-with-invalid.json'));

            expect(error.message)
                .toContain('ERROR: unable to parse existing-file-with-invalid.json as a JSON or YAML file');
        });
    });

    describe('when the input location is a URL', () => {
        it('should call the http client handler with the provided location', async () => {
            await specLoader.load('http://input.url');

            expect(mockHttpClient.get).toHaveBeenCalledWith('http://input.url');
        });

        it('should error out when the http client returns an error', async () => {
            mockHttpClient.givenGetFailsWith(new Error('test http client error'));

            const error = await expectToFail(specLoader.load('http://url.that.errors.out'));

            expect(error.message).toEqual(jasmine.stringMatching('test http client error'));
        });

        it('should return the url contents parsed when able to open the url', async () => {
            const urlContents: string = '{ "url": "contents" }';
            mockHttpClient.givenGetReturns(urlContents);

            const results = await specLoader.load('http://url.that.works');

            expect(results).toEqual(JSON.parse(urlContents));
        });

        it('should error out when the url returns non-json and non-yaml content', async () => {
            const urlContents: string = '{this is not json or yaml';
            mockHttpClient.givenGetReturns(urlContents);

            const error = await expectToFail(specLoader.load('http://url.that.loads.but.has.no.json.or.yaml'));

            expect(error.message).toContain('ERROR: unable to parse http://url.that.loads.but.has.no.json.or.yaml');
        });
    });
});
