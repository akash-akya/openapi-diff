import * as yaml from 'js-yaml';
import {OpenAPIObject} from 'openapi3-ts';
// tslint:disable:no-implicit-dependencies
import {Spec} from 'swagger-schema-official';
import {SpecOption} from '../../api-types';
import {OpenApiDiffErrorImpl} from '../../common/open-api-diff-error-impl';

type SpecFormats = Spec | OpenAPIObject;

export class SpecDeserialiser {
    public static load(specOption: SpecOption): SpecFormats {
        return SpecDeserialiser.parseSpec(specOption.location, specOption.content);
    }

    private static parseSpec(location: string, content: string): SpecFormats {
        try {
            return JSON.parse(content);
        } catch (parseJsonError) {
            try {
                return yaml.safeLoad(content);
            } catch (error) {
                throw new OpenApiDiffErrorImpl(
                    'openapi-diff.specdeserialiser.error',
                    `Unable to parse ${location} as a JSON or YAML file`
                );
            }
        }
    }
}
