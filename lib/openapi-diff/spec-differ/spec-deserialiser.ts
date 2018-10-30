import * as yaml from 'js-yaml';
import {OpenApiDiffErrorImpl} from '../../common/open-api-diff-error-impl';
import {SerialisedSpec} from '../../openapi-diff';

export class SpecDeserialiser {
    public static load(specOption: SerialisedSpec): any {
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
                    'OPENAPI_DIFF_PARSE_ERROR',
                    `Unable to parse "${location}" as a JSON or YAML file`
                );
            }
        }
    }
}
