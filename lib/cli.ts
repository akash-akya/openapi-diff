#! /usr/bin/env node

import * as commander from 'commander';
import * as _ from 'lodash';
import {CliFactory} from './cli-factory';

// tslint:disable:no-var-requires
const packageJson = require('../package.json');
const newLineChar = '\n';
const openApiDiff = CliFactory.createOpenApiDiff();

commander
    .version(packageJson.version)
    .arguments('<source> <destination>')
    .description(
        `A CLI tool to identify differences between Swagger/OpenAPI specs.

        Supported spec formats:
        - JSON

        Basic usage:
        The <source> spec and <destination> spec arguments should be paths to where the specs live in your filesystem.`)
    .action(async (sourceSpecPath, destinationSpecPath) => {
        try {
            const results = await openApiDiff.validate(sourceSpecPath, destinationSpecPath);

            console.log(`* OpenAPI Diff v${packageJson.version} *`);
            console.log(newLineChar);

            console.log('Inputs');
            console.log('------');
            console.log(`Source spec: ${sourceSpecPath}`);
            console.log(`Destination spec: ${destinationSpecPath}`);
            console.log(newLineChar);

            console.log('Summary');
            console.log('-------');
            console.log(results.summary.join(newLineChar));

            if (!(_.isEmpty(results.changeList))) {
                console.log(newLineChar);
                console.log('Details');
                console.log('-------');
                console.log(results.changeList.join(newLineChar));
                console.log(newLineChar);
            }

            if (results.hasBreakingChanges) {
                console.log('DANGER: Breaking changes found!');
                process.exit(1);
            }
        } catch (error) {
            console.error(error.message);
            process.exit(2);
        }
    })
    .parse(process.argv);

if (!commander.args.length) {
    commander.help();
}
