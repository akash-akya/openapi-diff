import * as VError from 'verror';

import mockJsonLoader from '../support/mock-json-loader';

describe('jsonLoader', () => {

    describe('when the input location is a file', () => {

        it('should error out when unable to read the file', (done) => {

            const jsonLoader = mockJsonLoader.overrideFsReadFileResponseWith(new Error(), null);

            jsonLoader.load('non-existing-file.json')
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error: VError) => { // TODO: dodgy
                    expect(error.message)
                        .toEqual(jasmine.stringMatching('ERROR: unable to read non-existing-file.json'));
            }).then(done, done.fail);
        });

        it('should return the file contents parsed when able to read the file', (done) => {

            const fileContents: string = '{ "file": "contents" }';
            const jsonLoader = mockJsonLoader.overrideFsReadFileResponseWith(null, fileContents);

            jsonLoader.load('ok-file.json')
                .then((results: any) => { // TODO: dodgy
                    expect(results).toEqual(JSON.parse(fileContents));
                })
                .then(done, done.fail);
        });

        it('should error out when unable to parse the file contents as json', (done) => {

            const jsonLoader = mockJsonLoader.overrideFsReadFileResponseWith(null, 'this is not json');

            jsonLoader.load('existing-file-with-invalid.json')
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
            const jsonLoader = mockJsonLoader.overrideRequestGetResponseWith(new Error('error message'), null, null);

            jsonLoader.load('http://url.that.errors.out')
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error: VError) => { // TODO: dodgy
                expect(error.message)
                    .toEqual('ERROR: unable to open http://url.that.errors.out: error message');
            }).then(done, done.fail);
        });

        it('should error out when the url returns a non-200 response code', (done) => {

            const mockResponse = { statusCode: 404 };
            const jsonLoader = mockJsonLoader.overrideRequestGetResponseWith(null, mockResponse, null);

            jsonLoader.load('http://url.that.is.not.there')
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error: VError) => { // TODO: dodgy
                expect(error.message)
                    .toEqual('ERROR: unable to fetch http://url.that.is.not.there. Response code: 404');
            }).then(done, done.fail);
        });

        it('should return the url contents parsed when able to open the url', (done) => {

            const mockResponse = { statusCode: 200 };
            const urlContents: string = '{ "url": "contents" }';
            const jsonLoader = mockJsonLoader.overrideRequestGetResponseWith(null, mockResponse, urlContents);

            jsonLoader.load('http://url.that.works')
                .then((results: any) => { // TODO: dodgy
                    expect(results).toEqual(JSON.parse(urlContents));
                })
                .then(done, done.fail);
        });

        it('should error out when url returns non-json content', (done) => {

            const mockResponse = { statusCode: 200 };
            const urlContents: string = 'this is not json';
            const jsonLoader = mockJsonLoader.overrideRequestGetResponseWith(null, mockResponse, urlContents);

            jsonLoader.load('http://url.that.loads.but.has.no.json')
                .then(() => {
                    fail('test expected to error out but it didn\'t');
                }).catch((error: VError) => { // TODO: dodgy
                expect(error.message)
                    .toContain('ERROR: unable to parse http://url.that.loads.but.has.no.json as a JSON file');
            }).then(done, done.fail);
        });

    });
});
