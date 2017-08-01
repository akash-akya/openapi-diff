#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const _ = require("lodash");
const openapi_diff_1 = require("./openapi-diff");
// tslint:disable:no-var-requires
const packageJson = require('../package.json');
const newLineChar = '\n';
commander
    .version(packageJson.version)
    .arguments('<old> <new>')
    .description(`A CLI tool to identify differences between Swagger/OpenAPI specs.

        Supported spec formats:
        - JSON

        Basic usage:
        The <old> spec and <new> spec arguments should be paths to where the specs live in your filesystem.`)
    .action((oldSpecPath, newSpecPath) => {
    openapi_diff_1.default.run(oldSpecPath, newSpecPath)
        .then((results) => {
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
            console.log(newLineChar);
        }
        if (results.hasBreakingChanges) {
            console.log('DANGER: Breaking changes found!');
            process.exit(1);
        }
    }).catch((error) => {
        console.error(error.message);
        process.exit(2);
    });
})
    .parse(process.argv);
if (!commander.args.length) {
    commander.help();
}
