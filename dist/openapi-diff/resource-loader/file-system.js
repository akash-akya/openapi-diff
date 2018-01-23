"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const VError = require("verror");
const path = require("path");
const fileSystem = {
    readFile: (location) => {
        const filePath = path.resolve(location);
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (error, fileContents) => {
                if (error) {
                    reject(new VError(error, `ERROR: unable to read ${location}`));
                }
                else {
                    resolve(fileContents.toString());
                }
            });
        });
    }
};
exports.default = fileSystem;
