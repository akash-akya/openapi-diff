"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const q = require("q");
const url = require("url");
const VError = require("verror");
const isUrl = (location) => {
    const urlObject = url.parse(location);
    return urlObject.protocol !== null;
};
const parseAsJson = (location, content) => {
    try {
        return q(JSON.parse(content));
    }
    catch (error) {
        return q.reject(new VError(error, `ERROR: unable to parse ${location} as a JSON file`));
    }
};
exports.default = {
    load: (location, fileSystem, httpClient) => {
        const loader = isUrl(location) ? httpClient.get : fileSystem.readFile;
        return loader(location).then((fileContents) => {
            return parseAsJson(location, fileContents);
        });
    }
};
