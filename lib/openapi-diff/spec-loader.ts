import * as yaml from 'js-yaml';
import {OpenAPIObject} from 'openapi3-ts';
// tslint:disable:no-implicit-dependencies
import {Spec} from 'swagger-schema-official';
import * as url from 'url';
import * as VError from 'verror';
import {FileSystem} from './resource-loader/file-system';
import {HttpClient} from './resource-loader/http-client';

export class SpecLoader {
    private static parseSpec(location: string, content: string): Promise<Spec | OpenAPIObject> {
        try {
            return Promise.resolve(SpecLoader.parseJson(location, content));
        } catch (parseJsonError) {
            try {
                return Promise.resolve(SpecLoader.parseYaml(location, content));
            } catch (parseYamlError) {
                return Promise.reject(parseYamlError);
            }
        }
    }

    private static parseJson(location: string, content: string): Spec | OpenAPIObject {
        try {
            return JSON.parse(content);
        } catch (error) {
            throw new VError(`ERROR: unable to parse ${location} as a JSON or YAML file`);
        }
    }

    private static parseYaml(location: string, content: string): Spec | OpenAPIObject {
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
    }

    private static isUrl(location: string): boolean {
        const urlObject = url.parse(location);
        return urlObject.protocol !== null;
    }

    constructor(private readonly httpClient: HttpClient, private readonly fileSystem: FileSystem) {}

    public async load(location: string): Promise<Spec | OpenAPIObject> {
        const fileContents = SpecLoader.isUrl(location)
            ? await this.httpClient.get(location)
            : await this.fileSystem.readFile(location);

        return SpecLoader.parseSpec(location, fileContents);
    }
}
