#! /usr/bin/env node

import * as commander from 'commander';
import * as _ from 'lodash';
import openApiDiff from './openapi-diff';

// tslint:disable:no-var-requires
const packageJson = require('../package.json');

const newLineChar = '\n';

commander
    .version(packageJson.version)
    .arguments('<old> <new>')
    .description(
        `A CLI tool to identify differences between Swagger/OpenAPI specs.

        Supported spec formats:
        - JSON

        Basic usage:
        The <old> spec and <new> spec arguments should be paths to where the specs live in your filesystem.`)
    .action((oldSpecPath, newSpecPath) => {
        const results = openApiDiff.run(oldSpecPath, newSpecPath);

        console.log(`* OpenAPI Diff v${packageJson.version} *`);
        console.log(newLineChar);

        console.log('Inputs');
        console.log('------');
        console.log(`Old spec: ${oldSpecPath}`);
        console.log(`New spec: ${newSpecPath}`);
        console.log(newLineChar);

        console.log('Summary');
        console.log('-------');
        console.log(results.summary.join(newLineChar));

        if (!(_.isEmpty(results.changeList))) {
            console.log(newLineChar);
            console.log('Details');
            console.log('-------');
            console.log(results.changeList.join(newLineChar));
        }
    })
    .parse(process.argv);

if (!commander.args.length) {
    commander.help();
}
