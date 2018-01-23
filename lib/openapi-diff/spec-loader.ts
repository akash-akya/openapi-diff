import * as yaml from 'js-yaml';
import { OpenAPIObject } from 'openapi3-ts';
// tslint:disable:no-implicit-dependencies
import { Spec } from 'swagger-schema-official';
import * as url from 'url';
import * as VError from 'verror';

import {
    FileSystem,
    HttpClient,
    ResourceLoaderFunction
} from './types';

const isUrl = (location: string): boolean => {
    const urlObject = url.parse(location);
    return urlObject.protocol !== null;
};

const parseYaml = (location: string, content: string): Spec | OpenAPIObject  => {
    let parsedYaml = null;
    try {
        parsedYaml = yaml.safeLoad(content);
    } catch (error) {
        throw new VError(`ERROR: unable to parse ${location} as a JSON or YAML file`);
    }

    if (!parsedYaml) {
        throw new VError(`ERROR: unable to parse ${location} as a JSON or YAML file`);
    }

    return parsedYaml;
};

const parseJson = (location: string, content: string): Spec | OpenAPIObject => {
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new VError(`ERROR: unable to parse ${location} as a JSON or YAML file`);
    }
};

const parseSpec = (location: string, content: string): Promise<Spec | OpenAPIObject> => {
    try {
        return Promise.resolve(parseJson(location, content));
    } catch (parseJsonError) {
        try {
            return Promise.resolve(parseYaml(location, content));
        } catch (parseYamlError) {
            return Promise.reject(parseYamlError);
        }
    }
};

export default {
    load: async (location: string, fileSystem: FileSystem, httpClient: HttpClient) => {
        const loader: ResourceLoaderFunction = isUrl(location) ? httpClient.get : fileSystem.readFile;

        const fileContents = await loader(location);

        return parseSpec(location, fileContents);
    }
};
