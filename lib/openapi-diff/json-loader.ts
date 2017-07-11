import * as fs from 'fs';
import * as q from 'q';
import * as request from 'request';
import * as url from 'url';

import {isAbsolute, resolve} from 'path';
import {OpenAPISpec} from './types';

const isUrl = (location: string): boolean => {
    const urlObject = url.parse(location);
    return urlObject.protocol !== null;
};

const getAbsoluteFilePath = (location: string): string => {
    let absoluteFilePath: string;
    if (isAbsolute(location)) {
        absoluteFilePath = location;
    } else {
        const currentDir = resolve(process.cwd());
        absoluteFilePath = `${currentDir}/${location}`;
    }
    return absoluteFilePath;
};

export default {
    load: (location: string): q.Promise<OpenAPISpec> => {
        const deferred = q.defer<OpenAPISpec>();

        if (isUrl(location)) {
            request.get(location, (error, response, body) => {
                if (error) {
                    deferred.reject(`ERROR: unable to open ${location}`);
                } else if (response.statusCode !== 200) {
                    deferred.reject(`ERROR: unable to fetch ${location}. Response code: ${response.statusCode}`);
                } else {
                    try {
                        deferred.resolve(JSON.parse(body));
                    } catch (error) {
                        deferred.reject(`ERROR: unable to parse ${location} as a JSON file`);
                    }
                }
            });
        } else {
            const filePath = getAbsoluteFilePath(location);

            fs.readFile(filePath, 'utf8', (error, fileContent) => {
                if (error) {
                    deferred.reject(`ERROR: unable to read ${location}`);
                } else {
                    try {
                        deferred.resolve(JSON.parse(fileContent));
                    } catch (error) {
                        deferred.reject(`ERROR: unable to parse ${location} as a JSON file`);
                    }
                }
            });
        }

        return deferred.promise;
    }
};
