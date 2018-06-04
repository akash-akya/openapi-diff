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
            destinationSpecLocation: `${currentDir}/test/e2e/fixtures/basic-destination.json`,
            sourceSpecLocation: `${currentDir}/test/e2e/fixtures/basic-source.json`
        });

        expect(result).toEqual(jasmine.stringMatching(
            `"location": "${currentDir}/test/e2e/fixtures/basic-source.json"`));
        expect(result).toEqual(jasmine.stringMatching(
            `"location": "${currentDir}/test/e2e/fixtures/basic-destination.json"`));
        expect(result).toEqual(jasmine.stringMatching('Non breaking changes found between the two specifications'));
    });

    it('should exit with error when unable to find files on the local filesystem', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/non-existing-destination.json',
            sourceSpecLocation: 'test/e2e/fixtures/non-existing-source.json'
        }));

        expect(error).toEqual(jasmine.stringMatching(
            'ERROR: unable to read test/e2e/fixtures/non-existing-source.json'));
    });

    it('should exit with error when unable to parse files as json from the local filesystem', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/not-a-json-or-yaml.txt',
            sourceSpecLocation: 'test/e2e/fixtures/not-a-json-or-yaml.txt'
        }));

        expect(error).toEqual(jasmine.stringMatching(
            'ERROR: unable to parse test/e2e/fixtures/not-a-json-or-yaml.txt as a JSON or YAML file'));
    });

    it('should allow loading specs from URL locations', async () => {
        const result = await invokeCommand({
            destinationSpecLocation: 'http://localhost:3000/basic-destination.json',
            sourceSpecLocation: 'http://localhost:3000/basic-source.json'
        });

        expect(result).toEqual(jasmine.stringMatching(
            '"location": "http://localhost:3000/basic-source.json"'));
        expect(result).toEqual(jasmine.stringMatching(
            '"location": "http://localhost:3000/basic-destination.json"'));
        expect(result).toEqual(jasmine.stringMatching('Non breaking changes found between the two specifications'));
    });

    it('should exit with error when unable to load the URLs provided', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'http://localhost:3000/basic-destination.json',
            sourceSpecLocation: 'htt://localhost:3000/basic-source.json'
        }));

        expect(error).toEqual(jasmine.stringMatching('ERROR: unable to open htt://localhost:3000/basic-source.json'));
    });

    it('should exit with error when unable to fetch files over http', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'http://localhost:3000/basic-destination.json',
            sourceSpecLocation: 'http://localhost:3000/non-existing-source.json'
        }));

        expect(error).toEqual(jasmine.stringMatching(
            'ERROR: unable to fetch http://localhost:3000/non-existing-source.json. Response code: 404'));
    });

    it('should exit with error when unable to parse files as json or yaml over http', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'http://localhost:3000/basic-destination.json',
            sourceSpecLocation: 'http://localhost:3000/not-a-json-or-yaml.txt'
        }));

        expect(error).toEqual(jasmine.stringMatching(
            'ERROR: unable to parse http://localhost:3000/not-a-json-or-yaml.txt as a JSON or YAML file'));
    });

    it('should succeed when no differences are found', async () => {
        const result = await invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/basic-source.json',
            sourceSpecLocation: 'test/e2e/fixtures/basic-source.json'
        });

        expect(result).toEqual(jasmine.stringMatching('No changes found between the two specifications'));
    });

    it('should succeed when no breaking differences are found', async () => {
        const result = await invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/basic-destination.json',
            sourceSpecLocation: 'test/e2e/fixtures/basic-source.json'
        });

        expect(result).toEqual(jasmine.stringMatching('Non breaking changes found between the two specifications'));
        expect(result).toEqual(jasmine.stringMatching('"type": "non-breaking"'));
    });

    it('should exit with error when breaking differences are found', async () => {
        const error = await expectToFail(invokeCommand({
            destinationSpecLocation: 'test/e2e/fixtures/petstore-swagger-2-destination.json',
            sourceSpecLocation: 'test/e2e/fixtures/petstore-swagger-2-source.json'
        }));

        expect(error.message).toEqual(jasmine.stringMatching('"type": "breaking"'));
    });
});
