import specLoader from '../../../lib/openapi-diff/spec-loader';
import {FileSystem, HttpClient} from '../../../lib/openapi-diff/types';
import expectToFail from '../../support/expect-to-fail';
import fileSystemMockGenerator from '../support/mocks/file-system-mock-generator';
import httpClientMockGenerator from '../support/mocks/http-client-mock-generator';

describe('specLoader', () => {
    let naiveFileSystem: FileSystem;
    let naiveHttpClient: HttpClient;

    beforeEach(() => {
        naiveFileSystem = fileSystemMockGenerator.createWithReturnValue('{}');
        naiveHttpClient = httpClientMockGenerator.createWithReturnValue('{}');
    });

    describe('when the input location is a file', () => {

        it('should call the file system handler with the provided location', async () => {

            await specLoader.load('input-file.json', naiveFileSystem, naiveHttpClient);

            expect(naiveFileSystem.readFile).toHaveBeenCalledWith('input-file.json');
        });

        it('should error out when the file system returns an error', async () => {

            const mockFileSystem = fileSystemMockGenerator.createWithReturnError(new Error('test file system error'));

            const error = await expectToFail(specLoader
                .load('non-existing-file.json', mockFileSystem, naiveHttpClient));

            expect(error.message).toEqual(jasmine.stringMatching('test file system error'));
        });

        it('should return the file contents parsed when able to read the file', async () => {

            const fileContents: string = '{ "file": "contents" }';
            const mockFileSystem = fileSystemMockGenerator.createWithReturnValue(fileContents);

            const results = await specLoader.load('ok-file.json', mockFileSystem, naiveHttpClient);

            expect(results).toEqual(JSON.parse(fileContents));
        });

        it('should error out when unable to parse the file contents as json or yaml', async () => {

            const fileContents: string = '{this is not json or yaml';
            const mockFileSystem = fileSystemMockGenerator.createWithReturnValue(fileContents);

            const error = await expectToFail(specLoader
                .load('existing-file-with-invalid.json', mockFileSystem, naiveHttpClient));

            expect(error.message)
                .toContain('ERROR: unable to parse existing-file-with-invalid.json as a JSON or YAML file');
        });
    });

    describe('when the input location is a URL', () => {

        it('should call the http client handler with the provided location', async () => {

            await specLoader.load('http://input.url', naiveFileSystem, naiveHttpClient);

            expect(naiveHttpClient.get).toHaveBeenCalledWith('http://input.url');
        });

        it('should error out when the http client returns an error', async () => {

            const mockHttpClient = httpClientMockGenerator.createWithReturnError(new Error('test http client error'));

            const error = await expectToFail(specLoader
                .load('http://url.that.errors.out', naiveFileSystem, mockHttpClient));

            expect(error.message).toEqual(jasmine.stringMatching('test http client error'));
        });

        it('should return the url contents parsed when able to open the url', async () => {

            const urlContents: string = '{ "url": "contents" }';
            const mockHttpClient = httpClientMockGenerator.createWithReturnValue(urlContents);

            const results = await specLoader.load('http://url.that.works', naiveFileSystem, mockHttpClient);

            expect(results).toEqual(JSON.parse(urlContents));
        });

        it('should error out when the url returns non-json and non-yaml content', async () => {

            const urlContents: string = '{this is not json or yaml';
            const mockHttpClient = httpClientMockGenerator.createWithReturnValue(urlContents);

            const error = await expectToFail(specLoader
                .load('http://url.that.loads.but.has.no.json.or.yaml', naiveFileSystem, mockHttpClient));

            expect(error.message)
                .toContain('ERROR: unable to parse http://url.that.loads.but.has.no.json.or.yaml');
        });
    });
});
