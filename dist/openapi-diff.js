"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_system_1 = require("./openapi-diff/resource-loader/file-system");
const http_client_1 = require("./openapi-diff/resource-loader/http-client");
const result_reporter_1 = require("./openapi-diff/result-reporter");
const spec_differ_1 = require("./openapi-diff/spec-differ");
const spec_loader_1 = require("./openapi-diff/spec-loader");
const spec_parser_1 = require("./openapi-diff/spec-parser");
exports.openApiDiff = {
    run: (oldSpecPath, newSpecPath) => __awaiter(this, void 0, void 0, function* () {
        const whenOldSpec = spec_loader_1.default.load(oldSpecPath, file_system_1.default, http_client_1.default);
        const whenNewSpec = spec_loader_1.default.load(newSpecPath, file_system_1.default, http_client_1.default);
        const rawSpecs = yield Promise.all([whenOldSpec, whenNewSpec]);
        const oldSpec = rawSpecs[0];
        const oldParsedSpec = spec_parser_1.default.parse(oldSpec);
        const newSpec = rawSpecs[1];
        const newParsedSpec = spec_parser_1.default.parse(newSpec);
        const diff = spec_differ_1.default.diff(oldParsedSpec, newParsedSpec);
        const results = result_reporter_1.default.build(diff);
        return results;
    })
};
