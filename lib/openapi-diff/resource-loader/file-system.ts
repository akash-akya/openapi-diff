import * as fs from 'fs';
import * as path from 'path';

export class FileSystem {
    public readFile(location: string): Promise<string> {
        const filePath = path.resolve(location);

        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (error, fileContents) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(fileContents.toString());
                }
            });
        });
    }
}
