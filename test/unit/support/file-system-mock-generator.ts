import * as q from 'q';
import * as VError from 'verror';

import { FileSystem } from '../../../lib/openapi-diff/types';

export default {
    createWithReturnValue: (error: NodeJS.ErrnoException | null, fileContents?: string): FileSystem => {

        const mockFileSystem: FileSystem = {
            readFile: (location: string) => {
                const deferred = q.defer<string>();
                if (error) {
                    deferred.reject(new VError(error, `ERROR: unable to read ${location}`));
                } else {
                    deferred.resolve(fileContents);
                }
                return deferred.promise;
            }
        };

        return mockFileSystem;
    }
};
