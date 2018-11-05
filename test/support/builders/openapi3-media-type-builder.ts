import * as _ from 'lodash';
import {OpenApi3MediaType} from '../../../lib/openapi-diff/openapi3';
import {setPropertyIfDefined} from './builder-utils';

interface OpenApi3MediaTypeBuilderState {
    schema?: any;
}

export class OpenApi3MediaTypeBuilder {
    public static defaultOpenApi3MediaTypeBuilder(): OpenApi3MediaTypeBuilder {
        return new OpenApi3MediaTypeBuilder({});
    }

    private constructor(private readonly state: OpenApi3MediaTypeBuilderState) {
    }

    public withJsonContentSchema(jsonContentSchema: any) {
        const copyOfJsonContentSchema = _.cloneDeep(jsonContentSchema);
        return new OpenApi3MediaTypeBuilder(
            {...this.state, schema: copyOfJsonContentSchema}
        );
    }

    public withSchemaRef($ref: string): OpenApi3MediaTypeBuilder {
        return this.withJsonContentSchema({$ref});
    }

    public build(): OpenApi3MediaType {
        const mediaType: OpenApi3MediaType = {};
        setPropertyIfDefined(mediaType, 'schema', this.state.schema);

        return mediaType;
    }
}

export const openApi3MediaTypeBuilder = OpenApi3MediaTypeBuilder.defaultOpenApi3MediaTypeBuilder();
