import * as fs from 'fs';
import * as path from 'path';
import * as VError from 'verror';

export class FileSystem {
    public readFile(location: string): Promise<string> {
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
}
