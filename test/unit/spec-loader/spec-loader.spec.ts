import {OpenAPIObject} from 'openapi3-ts';
// tslint:disable:no-implicit-dependencies
import {Spec} from 'swagger-schema-official';
import {SpecLoader} from '../../../lib/openapi-diff/spec-loader';
import {expectToFail} from '../../support/expect-to-fail';
import {createMockFileSystem, MockFileSystem} from '../support/mocks/mock-file-system';
import {createMockHttpClient, MockHttpClient} from '../support/mocks/mock-http-client';

describe('specLoader', () => {
    let mockHttpClient: MockHttpClient;
    let mockFileSystem: MockFileSystem;

    beforeEach(() => {
        mockFileSystem = createMockFileSystem();
        mockFileSystem.givenReadFileReturns('{}');
        mockHttpClient = createMockHttpClient();
        mockHttpClient.givenGetReturns('{}');
    });

    const invokeLoad = (location: string): Promise<Spec | OpenAPIObject> => {
        const specLoader = new SpecLoader(mockHttpClient, mockFileSystem);
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

        it('should return the file contents parsed when able to read the file', async () => {
            const fileContents: string = '{ "file": "contents" }';
            mockFileSystem.givenReadFileReturns(fileContents);

            const results = await invokeLoad('ok-file.json');

            expect(results).toEqual(JSON.parse(fileContents));
        });

        it('should error out when unable to parse the file contents as json or yaml', async () => {
            const fileContents: string = '{this is not json or yaml';
            mockFileSystem.givenReadFileReturns(fileContents);

            const error = await expectToFail(invokeLoad('existing-file-with-invalid.json'));

            expect(error.message)
                .toContain('ERROR: unable to parse existing-file-with-invalid.json as a JSON or YAML file');
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

        it('should return the url contents parsed when able to open the url', async () => {
            const urlContents: string = '{ "url": "contents" }';
            mockHttpClient.givenGetReturns(urlContents);

            const results = await invokeLoad('http://url.that.works');

            expect(results).toEqual(JSON.parse(urlContents));
        });

        it('should error out when the url returns non-json and non-yaml content', async () => {
            const urlContents: string = '{this is not json or yaml';
            mockHttpClient.givenGetReturns(urlContents);

            const error = await expectToFail(invokeLoad('http://url.that.loads.but.has.no.json.or.yaml'));

            expect(error.message).toContain('ERROR: unable to parse http://url.that.loads.but.has.no.json.or.yaml');
        });
    });
});
