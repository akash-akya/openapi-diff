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
const yaml = require("js-yaml");
const url = require("url");
const VError = require("verror");
const isUrl = (location) => {
    const urlObject = url.parse(location);
    return urlObject.protocol !== null;
};
const parseYaml = (location, content) => {
    let parsedYaml = null;
    try {
        parsedYaml = yaml.safeLoad(content);
    }
    catch (error) {
        throw new VError(`ERROR: unable to parse ${location} as a JSON or YAML file`);
    }
    if (!parsedYaml) {
        throw new VError(`ERROR: unable to parse ${location} as a JSON or YAML file`);
    }
    return parsedYaml;
};
const parseJson = (location, content) => {
    try {
        return JSON.parse(content);
    }
    catch (error) {
        throw new VError(`ERROR: unable to parse ${location} as a JSON or YAML file`);
    }
};
const parseSpec = (location, content) => {
    try {
        return Promise.resolve(parseJson(location, content));
    }
    catch (parseJsonError) {
        try {
            return Promise.resolve(parseYaml(location, content));
        }
        catch (parseYamlError) {
            return Promise.reject(parseYamlError);
        }
    }
};
exports.default = {
    load: (location, fileSystem, httpClient) => __awaiter(this, void 0, void 0, function* () {
        const loader = isUrl(location) ? httpClient.get : fileSystem.readFile;
        const fileContents = yield loader(location);
        return parseSpec(location, fileContents);
    })
};
