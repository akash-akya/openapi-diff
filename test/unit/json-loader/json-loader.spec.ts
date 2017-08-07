import jsonLoader from '../../../lib/openapi-diff/json-loader';
import {FileSystem, HttpClient} from '../../../lib/openapi-diff/types';
import fileSystemMockGenerator from '../support/file-system-mock-generator';
import httpClientMockGenerator from '../support/http-client-mock-generator';

describe('jsonLoader', () => {
    let naiveFileSystem: FileSystem;
    let naiveHttpClient: HttpClient;

    beforeEach(() => {
        naiveFileSystem = fileSystemMockGenerator.createWithReturnValue('{}');
        naiveHttpClient = httpClientMockGenerator.createWithReturnValue('{}');
    });

    describe('when the input location is a file', () => {

        it('should call the file system handler with the provided location', (done) => {

            jsonLoader.load('input-file.json', naiveFileSystem, naiveHttpClient)
                .then(() => {
                    expect(naiveFileSystem.readFile).toHaveBeenCalledWith('input-file.json');
            }).then(done, done.fail);
        });

        it('should error out when the file system returns an error', (done) => {

            const mockFileSystem = fileSystemMockGenerator.createWithReturnError(new Error('test file system error'));

            jsonLoader.load('non-existing-file.json', mockFileSystem, naiveHttpClient)
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error) => {
                    expect(error.message)
                        .toEqual(jasmine.stringMatching('test file system error'));
            }).then(done, done.fail);
        });

        it('should return the file contents parsed when able to read the file', (done) => {

            const fileContents: string = '{ "file": "contents" }';
            const mockFileSystem = fileSystemMockGenerator.createWithReturnValue(fileContents);

            jsonLoader.load('ok-file.json', mockFileSystem, naiveHttpClient)
                .then((results) => {
                    expect(results).toEqual(JSON.parse(fileContents));
                })
                .then(done, done.fail);
        });

        it('should error out when unable to parse the file contents as json', (done) => {

            const fileContents: string = 'this is not json';
            const mockFileSystem = fileSystemMockGenerator.createWithReturnValue(fileContents);

            jsonLoader.load('existing-file-with-invalid.json', mockFileSystem, naiveHttpClient)
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error) => {
                    expect(error.message)
                        .toContain('ERROR: unable to parse existing-file-with-invalid.json as a JSON file');
            }).then(done, done.fail);
        });
    });

    describe('when the input location is a URL', () => {

        it('should call the http client handler with the provided location', (done) => {

            jsonLoader.load('http://input.url', naiveFileSystem, naiveHttpClient)
                .then(() => {
                    expect(naiveHttpClient.get).toHaveBeenCalledWith('http://input.url');
            }).then(done, done.fail);
        });

        it('should error out when the http client returns an error', (done) => {

            const mockHttpClient = httpClientMockGenerator.createWithReturnError(new Error('test http client error'));

            jsonLoader.load('http://url.that.errors.out', naiveFileSystem, mockHttpClient)
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error) => {
                    expect(error.message)
                        .toEqual(jasmine.stringMatching('test http client error'));
            }).then(done, done.fail);
        });

        it('should return the url contents parsed when able to open the url', (done) => {

            const urlContents: string = '{ "url": "contents" }';
            const mockHttpClient = httpClientMockGenerator.createWithReturnValue(urlContents);

            jsonLoader.load('http://url.that.works', naiveFileSystem, mockHttpClient)
                .then((results) => {
                    expect(results).toEqual(JSON.parse(urlContents));
                })
                .then(done, done.fail);
        });

        it('should error out when the url returns non-json content', (done) => {

            const urlContents: string = 'this is not json';
            const mockHttpClient = httpClientMockGenerator.createWithReturnValue(urlContents);

            jsonLoader.load('http://url.that.loads.but.has.no.json', naiveFileSystem, mockHttpClient)
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error) => {
                    expect(error.message)
                        .toContain('ERROR: unable to parse http://url.that.loads.but.has.no.json as a JSON file');
            }).then(done, done.fail);
        });

    });
});
