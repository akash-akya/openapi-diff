import * as yaml from 'js-yaml';
import {OpenAPIObject} from 'openapi3-ts';
// tslint:disable:no-implicit-dependencies
import {Spec} from 'swagger-schema-official';
import * as VError from 'verror';
import {SpecOption} from '../../api-types';

type SpecFormats = Spec | OpenAPIObject;

export class SpecLoader {
    public static load(specOption: SpecOption): SpecFormats {
        return SpecLoader.parseSpec(specOption.location, specOption.content);
    }

    private static parseSpec(location: string, content: string): SpecFormats {
        try {
            return SpecLoader.parseJson(location, content);
        } catch (parseJsonError) {
            return SpecLoader.parseYaml(location, content);
        }
    }

    private static parseJson(location: string, content: string): SpecFormats {
        try {
            return JSON.parse(content);
        } catch (error) {
            throw new VError(`ERROR: unable to parse ${location} as a JSON or YAML file`);
        }
    }

    private static parseYaml(location: string, content: string): SpecFormats {
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
}
