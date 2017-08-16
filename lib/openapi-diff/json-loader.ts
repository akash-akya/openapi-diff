import * as q from 'q';
import * as url from 'url';
import * as VError from 'verror';

import { OpenAPIObject } from 'openapi3-ts';

import { Spec } from 'swagger-schema-official';

import {
    FileSystem,
    HttpClient,
    JsonLoaderFunction
} from './types';

const isUrl = (location: string): boolean => {
    const urlObject = url.parse(location);
    return urlObject.protocol !== null;
};

const parseAsJson = (location: string, content: string): q.Promise<Spec | OpenAPIObject> => {
    try {
        return q(JSON.parse(content));
    } catch (error) {
        return q.reject<OpenAPIObject>(new VError(error, `ERROR: unable to parse ${location} as a JSON file`));
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
