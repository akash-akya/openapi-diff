"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.default = {
    load: (filePath) => {
        let specJson;
        if (path_1.isAbsolute(filePath)) {
            specJson = require(filePath);
        }
        else {
            const currentDir = path_1.resolve(process.cwd());
            const absoluteFilePath = `${currentDir}/${filePath}`;
            specJson = require(absoluteFilePath);
        }
        return specJson;
    }
};
