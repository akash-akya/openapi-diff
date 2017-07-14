import * as fs from 'fs';
import * as q from 'q';
import * as request from 'request';
import * as url from 'url';
import * as VError from 'verror';

import {resolve} from 'path';
import {OpenAPISpec} from './types';

const isUrl = (location: string): boolean => {
    const urlObject = url.parse(location);
    return urlObject.protocol !== null;
};

const loadFile = (location: string): q.Promise<string> => {
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
};

const parseAsJson = (location: string, content: string): q.Promise<OpenAPISpec> => {
    try {
        return q(JSON.parse(content));
    } catch (error) {
        return q.reject<OpenAPISpec>(new VError(error, `ERROR: unable to parse ${location} as a JSON file`));
    }
};

const makeHttpRequest = (location: string): q.Promise<string> => {
    const deferred = q.defer<string>();

    request.get(location, (error, response, body) => {
        if (error) {
            deferred.reject(new VError(error, `ERROR: unable to open ${location}`));
        } else if (response.statusCode !== 200) {
            deferred.reject(new VError(error,
                                       `ERROR: unable to fetch ${location}. Response code: ${response.statusCode}`));
        } else {
            deferred.resolve(body);
        }
    });

    return deferred.promise;
};

export default {
    load: (location: string): q.Promise<OpenAPISpec> => {
        const getFileContents = isUrl(location) ? makeHttpRequest : loadFile;

        return getFileContents(location).then((fileContents) => {
            return parseAsJson(location, fileContents);
        });
    }
};
