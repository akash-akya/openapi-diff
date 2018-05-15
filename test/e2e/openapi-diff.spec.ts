import {exec} from 'child_process';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import ErrnoException = NodeJS.ErrnoException;
import * as VError from 'verror';

import {expectToFail} from '../support/expect-to-fail';

interface InvokeCommandOptions {
    destinationSpecLocation: string;
    sourceSpecLocation: string;
}

const invokeCommand = (options: InvokeCommandOptions): Promise<string> => {
    const command = `./bin/openapi-diff-local ${options.sourceSpecLocation} ${options.destinationSpecLocation}`;

    return new Promise((resolve, reject) => {
        exec(command, (error: ErrnoException, stdout, stderr) => {
            if (error) {
                reject(new VError(error, `Failed to run ${command}. `
                    + `Stdout: ${stdout.toString()}. Exit code: ${error.code}`));
            } else if (stderr) {
                reject(stderr);
            } else {
                resolve(stdout.toString());
            }
        });
    });
};

describe('openapi-diff', () => {

    let server: http.Server;

    beforeAll((done) => {
        const app = express();
        app.use(express.static('./test/e2e/fixtures'));
        server = app.listen(3000, done);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should work with absolute path yaml files', async () => {
       const currentDir = path.resolve(process.cwd());

       const result = await invokeCommand({
           destinationSpecLocation: `${currentDir}/test/e2e/fixtures/basic-destination.yaml`,
           sourceSpecLocation: `${currentDir}/test/e2e/fixtures/basic-source.yaml`
       });

       expect(result).toEqual(jasmine.stringMatching(`Source spec: ${currentDir}/test/e2e/fixtures/basic-source.yaml`));
       expect(result).toEqual(jasmine.stringMatching(
           `Destination spec: ${currentDir}/test/e2e/fixtures/basic-destination.yaml`));
       expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
       expect(result).toEqual(jasmine.stringMatching('1 non-breaking changes found.'));
       expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
    });

    it('should work with absolute path json files', async () => {
        const currentDir = path.resolve(process.cwd());

        const result = await invokeCommand({
            destinationSpecLocation: `${currentDir}/test/e2e/fixtures/basic-destination.json`,
            sourceSpecLocation: `${currentDir}/test/e2e/fixtures/basic-source.json`
        });

        expect(result).toEqual(jasmine.stringMatching(
            `Source spec: ${currentDir}/test/e2e/fixtures/basic-source.json`));
        expect(result).toEqual(jasmine.stringMatching(
            `Destination spec: ${currentDir}/test/e2e/fixtures/basic-destination.json`));
        expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('1 non-breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
    });

    it('should error gently when unable to find files on the local filesystem', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/non-existing-destination.json',
            sourceSpecLocation: 'test/e2e/fixtures/non-existing-source.json'
        }));

        expect(error).toEqual(jasmine.stringMatching('ERROR: unable to read ' +
            'test/e2e/fixtures/non-existing-source.json'));

        expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
    });

    it('should error gently when unable to parse files as json from the local filesystem', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/not-a-json-or-yaml.txt',
            sourceSpecLocation: 'test/e2e/fixtures/not-a-json-or-yaml.txt'
        }));

        expect(error).toEqual(jasmine.stringMatching('ERROR: unable to parse ' +
            'test/e2e/fixtures/not-a-json-or-yaml.txt as a JSON or YAML file'));

        expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
    });

    it('should work with URL locations', async () => {
        const result = await invokeCommand({
            destinationSpecLocation: 'http://localhost:3000/basic-destination.json',
            sourceSpecLocation: 'http://localhost:3000/basic-source.json'
        });

        expect(result).toEqual(jasmine.stringMatching(
            'Source spec: http://localhost:3000/basic-source.json'));
        expect(result).toEqual(jasmine.stringMatching(
            'Destination spec: http://localhost:3000/basic-destination.json'));
        expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('1 non-breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
    });

    it('should error gently when unable to use the URLs provided', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'http://localhost:3000/basic-destination.json',
            sourceSpecLocation: 'htt://localhost:3000/basic-source.json'
        }));

        expect(error).toEqual(jasmine.stringMatching('ERROR: unable to open ' +
            'htt://localhost:3000/basic-source.json'));

        expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
    });

    it('should error gently when unable to fetch files over http', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'http://localhost:3000/basic-destination.json',
            sourceSpecLocation: 'http://localhost:3000/non-existing-source.json'
        }));

        expect(error).toEqual(jasmine.stringMatching(
            'ERROR: unable to fetch http://localhost:3000/non-existing-source.json. Response code: 404'));

        expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
    });

    it('should error gently when unable to parse files as json over http', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'http://localhost:3000/basic-destination.json',
            sourceSpecLocation: 'http://localhost:3000/not-a-json-or-yaml.txt'
        }));

        expect(error).toEqual(jasmine.stringMatching('ERROR: unable to parse ' +
            'http://localhost:3000/not-a-json-or-yaml.txt as a JSON or YAML file'));

        expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
    });

    it('should succeed when the provided specs are equal', async () => {
        const result = await invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/basic-source.json',
            sourceSpecLocation: 'test/e2e/fixtures/basic-source.json'
        });

        expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 non-breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
    });

    it('should detect a single change', async () => {
        const result = await invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/basic-destination.json',
            sourceSpecLocation: 'test/e2e/fixtures/basic-source.json'
        });

        expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('1 non-breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
        expect(result).toContain('Non-breaking: the path [info/title] was modified ' +
            'from \'Test API\' to \'New Test API\'');
    });

    it('should detect multiple types of changes', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/complex-destination.json',
            sourceSpecLocation: 'test/e2e/fixtures/complex-source.json'
        }));

        expect(error.message).toEqual(jasmine.stringMatching('2 breaking changes found.'));
        expect(error.message).toEqual(jasmine.stringMatching('4 non-breaking changes found.'));
        expect(error.message).toEqual(jasmine.stringMatching('2 unclassified changes found.'));

        expect(error.message).toContain('Breaking: the path [host] with value \'some host info\' was removed');

        expect(error.message).toContain('Breaking: the path [basePath] was modified ' +
            'from \'/\' to \'/v2\'');

        expect(error.message).toContain('Non-breaking: the path [info/termsOfService] was modified ' +
            'from \'some terms\' to \'some new terms\'');

        expect(error.message).toContain('Non-breaking: the path [info/contact/name] was modified ' +
            'from \'Test name\' to \'New test name\'');

        expect(error.message).toContain('Non-breaking: the path [info/license/url] was modified ' +
            'from \'http://license.example.com\' to \'http://new.license.example.com\'');

        expect(error.message).toContain('Non-breaking: the path [swagger] was modified ' +
            'from \'2.0\' to \'2.1\'');

        expect(error.message).toContain('Unclassified: the path [info/x-info-property] was modified ' +
            'from \'some content\' to \'some new content\'');

        expect(error.message).toContain('Unclassified: the path [x-generic-property] was modified ' +
            'from \'some content\' to \'some new content\'');

        expect(error.message).not.toContain('the path [schemes');

        expect(error.message).toEqual(jasmine.stringMatching('DANGER: Breaking changes found!'));

        expect(error).toEqual(jasmine.stringMatching('Exit code: 1'));
    });

    it('should be able to process real Swagger 2.0 files', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/petstore-swagger-2-destination.json',
            sourceSpecLocation: 'test/e2e/fixtures/petstore-swagger-2-source.json'
        }));

        expect(error.message).toEqual(jasmine.stringMatching('3 breaking changes found.'));
        expect(error.message).toEqual(jasmine.stringMatching('5 non-breaking changes found.'));
        expect(error.message).toEqual(jasmine.stringMatching('1 unclassified changes found.'));

        expect(error.message).toContain('Breaking: the path [host] was modified ' +
            'from \'petstore.swagger.io\' to \'petstore.swagger.org\'');

        expect(error.message).toContain('Breaking: the path [basePath] was added with value \'/v2\'');

        expect(error.message).toContain('Breaking: the value \'http\' was removed ' +
            'from the array in the path [schemes/0]');

        expect(error.message).toContain('Non-breaking: the path [swagger] was modified ' +
            'from \'2.0\' to \'2.1\'');

        expect(error.message).toContain('Non-breaking: the path [info/version] was modified ' +
            'from \'1.0.0\' to \'1.0.1\'');

        expect(error.message).toContain('Non-breaking: the path [info/license/url] was added ' +
            'with value \'http://www.apache.org/licenses/LICENSE-2.0.html\'');

        expect(error.message).toContain('Non-breaking: the value \'https\' was added ' +
            'to the array in the path [schemes/0]');

        expect(error.message).toContain('Non-breaking: the value \'ws\' was added ' +
            'to the array in the path [schemes/1]');

        expect(error.message).toContain('Unclassified: the path [x-external-id] ' +
            'with value \'some x value\' was removed');

        expect(error.message).toEqual(jasmine.stringMatching('DANGER: Breaking changes found!'));

        expect(error).toEqual(jasmine.stringMatching('Exit code: 1'));
    });

    it('should be able to process real OpenApi 3.0.0 files', async () => {
        const result = await invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/openapi-3-destination.json',
            sourceSpecLocation: 'test/e2e/fixtures/openapi-3-source.json'
        });

        expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('5 non-breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('4 unclassified changes found.'));

        expect(result).toContain('Non-breaking: the path [openapi] was modified ' +
            'from \'3.0.0\' to \'3.0.0-RC1\'');

        expect(result).toContain('Non-breaking: the path [info/version] was modified ' +
            'from \'Test version\' to \'New test version\'');

        expect(result).toContain('Non-breaking: the path [info/title] was modified ' +
            'from \'Test API\' to \'New test API\'');

        expect(result).toContain('Non-breaking: the path [info/description] was added ' +
            'with value \'Brand new spec description\'');

        expect(result).toContain('Non-breaking: the path [info/license/url] with value ' +
            '\'spec license url\' was removed');

        expect(result).toContain('Unclassified: the path [info/x-info-property] was modified ' +
            'from \'Some content\' to \'Some new content\'');

        expect(result).toContain('Unclassified: the path [x-generic-property] was modified ' +
            'from \'Some content\' to \'Some new content\'');

        expect(result).toContain('Unclassified: the path [info/x-brand-new-property] was added ' +
            'with value \'Some brand new content\'');

        expect(result).toContain('Unclassified: the path [x-deleted-property] with value ' +
            '\'Some deleted content\' was removed');
    });
});
