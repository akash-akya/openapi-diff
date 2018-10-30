import {exec, ExecException} from 'child_process';
import * as express from 'express';
import * as http from 'http';
import * as VError from 'verror';

import {expectToFail} from '../support/expect-to-fail';

interface InvokeCommandOptions {
    destinationSpecLocation: string;
    sourceSpecLocation: string;
}

const invokeCommand = (options: InvokeCommandOptions): Promise<string> => {
    const command = `./bin/openapi-diff-local ${options.sourceSpecLocation} ${options.destinationSpecLocation}`;

    return new Promise((resolve, reject) => {
        exec(command, (error: ExecException, stdout, stderr) => {
            if (error) {
                const message = `Failed to run ${command}. Stdout: ${stdout.toString()}. Exit code: ${error.code}`;
                reject(new VError(error, message));
            } else if (stderr) {
                reject(stderr);
            } else {
                resolve(stdout.toString());
            }
        });
    });
};

describe('cli', () => {

    let server: http.Server;

    beforeAll((done) => {
        const app = express();
        app.use(express.static('./test/e2e/fixtures'));
        server = app.listen(3000, done);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should succeed when no breaking changes are found in swagger 2', async () => {
        const result = await invokeCommand({
            destinationSpecLocation: `test/e2e/fixtures/swagger/destination-with-no-breaking-changes.json`,
            sourceSpecLocation: `test/e2e/fixtures/swagger/source-with-no-breaking-changes.json`
        });

        expect(result).toEqual(jasmine.stringMatching('Non breaking changes found between the two specifications'));
    });

    it('should exit with error when breaking differences are found in swagger 2', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'http://localhost:3000/swagger/destination-with-breaking-changes.json',
            sourceSpecLocation: 'http://localhost:3000/swagger/source-with-breaking-changes.json'
        }));

        expect(error.message).toEqual(jasmine.stringMatching('"type": "breaking"'));
    });

    it('should exit with error when unable to parse content as json', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/not-a-json-or-yaml.txt',
            sourceSpecLocation: 'test/e2e/fixtures/not-a-json-or-yaml.txt'
        }));

        expect(error).toEqual(jasmine.stringMatching(
            'Unable to parse "test/e2e/fixtures/not-a-json-or-yaml.txt" as a JSON or YAML file'));
    });

    it('should succeed when no differences are found between openapi 3 specs', async () => {
        const result = await invokeCommand({
            destinationSpecLocation: `test/e2e/fixtures/openapi3/source-spec.json`,
            sourceSpecLocation: `test/e2e/fixtures/openapi3/source-spec.json`
        });

        expect(result).toEqual(jasmine.stringMatching('No changes found between the two specifications'));
    });

    it('should exit with error when breaking differences are found in open api 3', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/openapi3/breaking-destination-spec.json',
            sourceSpecLocation: 'test/e2e/fixtures/openapi3/source-spec.json'
        }));

        expect(error.message).toEqual(jasmine.stringMatching('Breaking changes found between the two specifications'));
    });
});
