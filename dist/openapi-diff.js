"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const q = require("q");
const json_loader_1 = require("./openapi-diff/json-loader");
const file_system_1 = require("./openapi-diff/json-loader/file-system");
const http_client_1 = require("./openapi-diff/json-loader/http-client");
const result_reporter_1 = require("./openapi-diff/result-reporter");
const spec_differ_1 = require("./openapi-diff/spec-differ");
const spec_parser_1 = require("./openapi-diff/spec-parser");
const openApiDiff = {
    run: (oldSpecPath, newSpecPath) => {
        const whenOldSpecPath = json_loader_1.default.load(oldSpecPath, file_system_1.default, http_client_1.default);
        const whenParsedOldSpec = whenOldSpecPath.then(spec_parser_1.default.parse);
        const whenNewSpecPath = json_loader_1.default.load(newSpecPath, file_system_1.default, http_client_1.default);
        const whenParsedNewSpec = whenNewSpecPath.then(spec_parser_1.default.parse);
        const whenDiff = q.all([whenParsedOldSpec, whenParsedNewSpec]).spread(spec_differ_1.default.diff);
        const whenResults = whenDiff.then(result_reporter_1.default.build);
        return whenResults;
    }
};
exports.default = openApiDiff;
