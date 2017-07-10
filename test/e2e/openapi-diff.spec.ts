import {exec} from 'child_process';
import {resolve} from 'path';
import * as q from 'q';
import * as VError from 'verror';

interface InvokeCommandOptions {
    newSpecPath: string;
    oldSpecPath: string;
}

const invokeCommand = (options: InvokeCommandOptions): Promise<string> => {
    const deferred = q.defer();

    const command = `./bin/openapi-diff-local ${options.oldSpecPath} ${options.newSpecPath}`;

    exec(command, (error, stdout) => {
        if (error) {
            deferred.reject(new VError(error, `Failed to execute ${command}. stdout: ${stdout.toString()}`));
        } else {
            deferred.resolve(stdout.toString());
        }
    });

    return deferred.promise as any;
};

describe('openapi-diff', () => {

    it('should work with absolute path files', (done) => {
        const currentDir = resolve(process.cwd());
        invokeCommand({
            newSpecPath: `${currentDir}/test/e2e/fixtures/basic-old.json`,
            oldSpecPath: `${currentDir}/test/e2e/fixtures/basic-old.json`
        }).then((result) => {
            expect(result).toEqual(jasmine.stringMatching('OpenAPI Diff'));
        }).then(done, done.fail);
    });

    it('should succeed when the provided specs are equal', (done) => {
        invokeCommand({
            newSpecPath: 'test/e2e/fixtures/basic-old.json',
            oldSpecPath: 'test/e2e/fixtures/basic-old.json'
        }).then((result) => {
            expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
            expect(result).toEqual(jasmine.stringMatching('0 non-breaking changes found.'));
            expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));
        }).then(done, done.fail);
    });

    it('should detect a non-breaking change when the provided specs have a different info object', (done) => {
        invokeCommand({
            newSpecPath: 'test/e2e/fixtures/basic-new.json',
            oldSpecPath: 'test/e2e/fixtures/basic-old.json'
        }).then((result) => {
            expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
            expect(result).toEqual(jasmine.stringMatching('1 non-breaking changes found.'));
            expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));

            expect(result).toContain('Non-breaking: the path [info/title] was modified ' +
                                     'from \'Test API\' to \'New Test API\'');
        }).then(done, done.fail);
    });

    it('should detect multiple types of changes', (done) => {
        invokeCommand({
            newSpecPath: 'test/e2e/fixtures/complex-new.json',
            oldSpecPath: 'test/e2e/fixtures/complex-old.json'
        }).then((result) => {
            expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
            expect(result).toEqual(jasmine.stringMatching('3 non-breaking changes found.'));
            expect(result).toEqual(jasmine.stringMatching('2 unclassified changes found.'));

            expect(result).toContain('Non-breaking: the path [info/termsOfService] was modified ' +
                                     'from \'some terms\' to \'some new terms\'');

            expect(result).toContain('Non-breaking: the path [info/contact/name] was modified ' +
                                     'from \'Test name\' to \'New test name\'');

            expect(result).toContain('Non-breaking: the path [info/license/url] was modified ' +
                                     'from \'http://license.example.com\' to \'http://new.license.example.com\'');

            expect(result).toContain('Unclassified: the path [info/x-info-property] was modified ' +
                                     'from \'some content\' to \'some new content\'');

            expect(result).toContain('Unclassified: the path [x-generic-property] was modified ' +
                                     'from \'some content\' to \'some new content\'');

        }).then(done, done.fail);
    });

    it('should be able to process real Swagger 2.0 files', (done) => {
        invokeCommand({
            newSpecPath: 'test/e2e/fixtures/petstore-swagger-2-new.json',
            oldSpecPath: 'test/e2e/fixtures/petstore-swagger-2-old.json'
        }).then((result) => {
            expect(result).toEqual(jasmine.stringMatching('0 breaking changes found.'));
            expect(result).toEqual(jasmine.stringMatching('2 non-breaking changes found.'));
            expect(result).toEqual(jasmine.stringMatching('0 unclassified changes found.'));

            expect(result).toContain('Non-breaking: the path [info/version] was modified ' +
                                     'from \'1.0.0\' to \'1.0.1\'');

            expect(result).toContain('Non-breaking: the path [info/license/name] was modified ' +
                                     'from \'Apache 2.0\' to \'Apache 2.1\'');
        }).then(done, done.fail);
    });
});
