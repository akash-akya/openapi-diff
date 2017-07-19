"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const q = require("q");
const VError = require("verror");
const path_1 = require("path");
const fileSystem = {
    readFile: (location) => {
        const deferred = q.defer();
        const filePath = path_1.resolve(location);
        fs.readFile(filePath, 'utf8', (error, fileContents) => {
            if (error) {
                deferred.reject(new VError(error, `ERROR: unable to read ${location}`));
            }
            else {
                deferred.resolve(fileContents);
            }
        });
        return deferred.promise;
    }
};
exports.default = fileSystem;
