import * as yaml from 'js-yaml';
import {SpecOption} from '../../api-types';
import {OpenApiDiffErrorImpl} from '../../common/open-api-diff-error-impl';

export class SpecDeserialiser {
    public static load(specOption: SpecOption): any {
        return SpecDeserialiser.parseSpec(specOption.location, specOption.content);
    }

    private static parseSpec(location: string, content: string): any {
        try {
            return JSON.parse(content);
        } catch (parseJsonError) {
            try {
                return yaml.safeLoad(content);
            } catch (error) {
                throw new OpenApiDiffErrorImpl(
                    'OPENAPI_DIFF_SPEC_DESERIALISER_ERROR',
                    `Unable to parse ${location} as a JSON or YAML file`
                );
            }
        }
    }
}
