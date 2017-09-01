import {exec} from 'child_process';
import * as path from 'path';
import ErrnoException = NodeJS.ErrnoException;

import * as express from 'express';
import * as http from 'http';
import * as VError from 'verror';

interface InvokeCommandOptions {
    newSpecLocation: string;
    oldSpecLocation: string;
}

const invokeCommand = (options: InvokeCommandOptions): Promise<string> => {

    const command = `./bin/openapi-diff-local ${options.oldSpecLocation} ${options.newSpecLocation}`;

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

    it('should work with absolute path files', async () => {
        const currentDir = path.resolve(process.cwd());

        const result = await invokeCommand({
            newSpecLocation: `${currentDir}/test/e2e/fixtures/basic-new.json`,
            oldSpecLocation: `${currentDir}/test/e2e/fixtures/basic-old.json`
        });

        expect(result).toEqual(jasmine.stringMatching(`Old spec: ${currentDir}/test/e2e/fixtures/basic-old.json`));
        expect(result).toEqual(jasmine.stringMatching(`New spec: ${currentDir}/test/e2e/fixtures/basic-new.json`));
        expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('1 non-breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
    });

    it('should error gently when unable to find files on the local filesystem', async () => {
        try {
            await invokeCommand({
                newSpecLocation: 'test/e2e/fixtures/non-existing-new.json',
                oldSpecLocation: 'test/e2e/fixtures/non-existing-old.json'
            });
        } catch (error) {
            expect(error).toEqual(jasmine.stringMatching('ERROR: unable to read ' +
                'test/e2e/fixtures/non-existing-old.json'));

            expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
        }
    });

    it('should error gently when unable to parse files as json from the local filesystem', async () => {
        try {
            await invokeCommand({
                newSpecLocation: 'test/e2e/fixtures/not-a-json.txt',
                oldSpecLocation: 'test/e2e/fixtures/not-a-json.txt'
            });
        } catch (error) {
            expect(error).toEqual(jasmine.stringMatching('ERROR: unable to parse ' +
                'test/e2e/fixtures/not-a-json.txt as a JSON file'));

            expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
        }
    });

    it('should work with URL locations', async () => {
        const result = await invokeCommand({
            newSpecLocation: 'http://localhost:3000/basic-new.json',
            oldSpecLocation: 'http://localhost:3000/basic-old.json'
        });

        expect(result).toEqual(jasmine.stringMatching('Old spec: http://localhost:3000/basic-old.json'));
        expect(result).toEqual(jasmine.stringMatching('New spec: http://localhost:3000/basic-new.json'));
        expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('1 non-breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
    });

    it('should error gently when unable to use the URLs provided', async () => {
        try {
            await invokeCommand({
                newSpecLocation: 'htt://localhost:3000/basic-new.json',
                oldSpecLocation: 'htt://localhost:3000/basic-old.json'
            });
        } catch (error) {
            expect(error).toEqual(jasmine.stringMatching('ERROR: unable to open ' +
                'htt://localhost:3000/basic-old.json'));

            expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
        }
    });

    it('should error gently when unable to fetch files over http', async () => {
        try {
            await invokeCommand({
                newSpecLocation: 'http://localhost:3000/non-existing-new.json',
                oldSpecLocation: 'http://localhost:3000/non-existing-old.json'
            });
        } catch (error) {
            expect(error).toEqual(jasmine.stringMatching(
                'ERROR: unable to fetch http://localhost:3000/non-existing-old.json. Response code: 404'));

            expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
        }
    });

    it('should error gently when unable to parse files as json over http', async () => {
        try {
            await invokeCommand({
                newSpecLocation: 'http://localhost:3000/not-a-json.txt',
                oldSpecLocation: 'http://localhost:3000/not-a-json.txt'
            });
        } catch (error) {
            expect(error).toEqual(jasmine.stringMatching('ERROR: unable to parse ' +
                'http://localhost:3000/not-a-json.txt as a JSON file'));

            expect(error).toEqual(jasmine.stringMatching('Exit code: 2'));
        }
    });

    it('should succeed when the provided specs are equal', async () => {
        const result = await invokeCommand({
            newSpecLocation: 'test/e2e/fixtures/basic-old.json',
            oldSpecLocation: 'test/e2e/fixtures/basic-old.json'
        });

        expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 non-breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
    });

    it('should detect a single change', async () => {
        const result = await invokeCommand({
            newSpecLocation: 'test/e2e/fixtures/basic-new.json',
            oldSpecLocation: 'test/e2e/fixtures/basic-old.json'
        });

        expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('1 non-breaking changes found.'));
        expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
        expect(result).toContain('Non-breaking: the path [info/title] was modified ' +
            'from \'Test API\' to \'New Test API\'');
    });

    it('should detect multiple types of changes', async () => {
        try {
            await invokeCommand({
                newSpecLocation: 'test/e2e/fixtures/complex-new.json',
                oldSpecLocation: 'test/e2e/fixtures/complex-old.json'
            });
        } catch (error) {
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
        }
    });

    it('should be able to process real Swagger 2.0 files', async () => {

        try {
            await invokeCommand({
                newSpecLocation: 'test/e2e/fixtures/petstore-swagger-2-new.json',
                oldSpecLocation: 'test/e2e/fixtures/petstore-swagger-2-old.json'
            });
        } catch (error) {
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
        }
    });

    it('should be able to process real OpenApi 3.0.0 files', async () => {
        const result = await invokeCommand({
            newSpecLocation: 'test/e2e/fixtures/openapi-3-new.json',
            oldSpecLocation: 'test/e2e/fixtures/openapi-3-old.json'
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
