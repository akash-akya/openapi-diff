import * as fs from 'fs';
import * as VError from 'verror';

import * as path from 'path';

import { FileSystem } from '../types';

const fileSystem: FileSystem = {
    readFile: (location) => {
        const filePath = path.resolve(location);

        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (error, fileContents) => {
                if (error) {
                    reject(new VError(error, `ERROR: unable to read ${location}`));
                } else {
                    resolve(fileContents.toString());
                }
            });
        });
    }
};

export default fileSystem;
