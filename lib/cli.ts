#! /usr/bin/env node

import * as commander from 'commander';
import {CliFactory} from './cli-factory';

// tslint:disable:no-var-requires
const packageJson = require('../package.json');
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
            await openApiDiff.diffPaths(sourceSpecPath, destinationSpecPath);
        } catch (error) {
            process.exit(1);
        }
    })
    .parse(process.argv);

if (!commander.args.length) {
    commander.help();
}
