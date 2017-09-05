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

const parseAsJson = (location: string, content: string): Promise<Spec | OpenAPIObject> => {
    try {
        return Promise.resolve(JSON.parse(content));
    } catch (error) {
        return Promise.reject(new VError(error, `ERROR: unable to parse ${location} as a JSON file`));
    }
};

export default {
    load: async (location: string, fileSystem: FileSystem, httpClient: HttpClient) => {
        const loader: JsonLoaderFunction = isUrl(location) ? httpClient.get : fileSystem.readFile;

        const fileContents = await loader(location);

        return parseAsJson(location, fileContents);
    }
};
