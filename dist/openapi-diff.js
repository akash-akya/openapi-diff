"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_loader_1 = require("./openapi-diff/json-loader");
const result_reporter_1 = require("./openapi-diff/result-reporter");
const spec_differ_1 = require("./openapi-diff/spec-differ");
const spec_parser_1 = require("./openapi-diff/spec-parser");
const openApiDiff = {
    run: (oldSpecPath, newSpecPath) => {
        const oldSpec = json_loader_1.default.load(oldSpecPath);
        const parsedOldSpec = spec_parser_1.default.parse(oldSpec);
        const newSpec = json_loader_1.default.load(newSpecPath);
        const parsedNewSpec = spec_parser_1.default.parse(newSpec);
        const diffResult = spec_differ_1.default.diff(parsedOldSpec, parsedNewSpec);
        const results = result_reporter_1.default.print(diffResult);
        return results;
    }
};
exports.default = openApiDiff;
