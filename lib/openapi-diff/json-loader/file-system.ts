import * as fs from 'fs';
import * as q from 'q';
import * as VError from 'verror';

import { resolve } from 'path';

import { FileSystem } from '../types';

const fileSystem: FileSystem = {
    readFile: (location) => {
        const deferred = q.defer<string>();
        const filePath = resolve(location);

        fs.readFile(filePath, 'utf8', (error, fileContents) => {
            if (error) {
                deferred.reject(new VError(error, `ERROR: unable to read ${location}`));
            } else {
                deferred.resolve(fileContents);
            }
        });

        return deferred.promise;
    }
};

export default fileSystem;
