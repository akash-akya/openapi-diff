import * as VError from 'verror';

import jsonLoader from '../../../lib/openapi-diff/json-loader';
import fileSystemMockGenerator from '../support/file-system-mock-generator';
import httpClientMockGenerator from '../support/http-client-mock-generator';

import { OpenAPISpec } from '../../../lib/openapi-diff/types';

describe('jsonLoader', () => {

    const naiveFileSystem = fileSystemMockGenerator.createWithReturnValue(null, '');
    const naiveHttpClient = httpClientMockGenerator.createWithReturnValue(null);

    describe('when the input location is a file', () => {

        it('should error out when unable to read the file', (done) => {

            const mockFileSystem = fileSystemMockGenerator.createWithReturnValue(new Error());

            jsonLoader.load('non-existing-file.json', mockFileSystem, naiveHttpClient)
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error: VError) => { // TODO: dodgy
                    expect(error.message)
                        .toEqual(jasmine.stringMatching('ERROR: unable to read non-existing-file.json'));
            }).then(done, done.fail);
        });

        it('should return the file contents parsed when able to read the file', (done) => {

            const fileContents: string = '{ "file": "contents" }';
            const mockFileSystem = fileSystemMockGenerator.createWithReturnValue(null, fileContents);

            jsonLoader.load('ok-file.json', mockFileSystem, naiveHttpClient)
                .then((results: OpenAPISpec) => { // TODO: dodgy
                    expect(results).toEqual(JSON.parse(fileContents));
                })
                .then(done, done.fail);
        });

        it('should error out when unable to parse the file contents as json', (done) => {

            const fileContents: string = 'this is not json';
            const mockFileSystem = fileSystemMockGenerator.createWithReturnValue(null, fileContents);

            jsonLoader.load('existing-file-with-invalid.json', mockFileSystem, naiveHttpClient)
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error: VError) => { // TODO: dodgy
                expect(error.message)
                    .toContain('ERROR: unable to parse existing-file-with-invalid.json as a JSON file');
            }).then(done, done.fail);
        });
    });

    describe('when the input location is a URL', () => {

        it('should error out when unable to open the url', (done) => {

            const mockHttpClient = httpClientMockGenerator.createWithReturnValue(new Error());

            jsonLoader.load('http://url.that.errors.out', naiveFileSystem, mockHttpClient)
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error: VError) => { // TODO: dodgy
                expect(error.message)
                    .toEqual(jasmine.stringMatching('ERROR: unable to open http://url.that.errors.out'));
            }).then(done, done.fail);
        });

        it('should error out when the url returns a non-200 response code', (done) => {

            const mockHttpClient = httpClientMockGenerator.createWithReturnValue(null, {statusCode: 404, body: null});

            jsonLoader.load('http://url.that.is.not.there', naiveFileSystem, mockHttpClient)
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error: VError) => { // TODO: dodgy
                expect(error.message)
                    .toEqual('ERROR: unable to fetch http://url.that.is.not.there. Response code: 404');
            }).then(done, done.fail);
        });

        it('should return the url contents parsed when able to open the url', (done) => {

            const urlContents: string = '{ "url": "contents" }';
            const mockHttpClient = httpClientMockGenerator
                .createWithReturnValue(null, {statusCode: 200, body: urlContents});

            jsonLoader.load('http://url.that.works', naiveFileSystem, mockHttpClient)
                .then((results: any) => { // TODO: dodgy
                    expect(results).toEqual(JSON.parse(urlContents));
                })
                .then(done, done.fail);
        });

        it('should error out when url returns non-json content', (done) => {

            const urlContents: string = 'this is not json';
            const mockHttpClient = httpClientMockGenerator
                .createWithReturnValue(null, {statusCode: 200, body: urlContents});

            jsonLoader.load('http://url.that.loads.but.has.no.json', naiveFileSystem, mockHttpClient)
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error: VError) => { // TODO: dodgy
                expect(error.message)
                    .toContain('ERROR: unable to parse http://url.that.loads.but.has.no.json as a JSON file');
            }).then(done, done.fail);
        });

    });
});
