import * as q from 'q';
import * as url from 'url';
import * as VError from 'verror';

import {
    FileSystem,
    HttpClient,
    JsonLoaderFunction,
    OpenAPISpec
} from './types';

const isUrl = (location: string): boolean => {
    const urlObject = url.parse(location);
    return urlObject.protocol !== null;
};

const parseAsJson = (location: string, content: string): q.Promise<OpenAPISpec> => {
    try {
        return q(JSON.parse(content));
    } catch (error) {
        return q.reject<OpenAPISpec>(new VError(error, `ERROR: unable to parse ${location} as a JSON file`));
    }
};

export default {
    load: (location: string, fileSystem: FileSystem, httpClient: HttpClient) => {
        const loader: JsonLoaderFunction = isUrl(location) ? httpClient.get : fileSystem.readFile;

        return loader(location).then((fileContents) => {
            return parseAsJson(location, fileContents);
        });
    }
};
