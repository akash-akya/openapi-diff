import * as _ from 'lodash';
import {OpenApi3Content} from '../../../lib/openapi-diff/openapi3';

interface OpenApi3ContentBuilderState {
    jsonContentSchema?: any;
    ref?: string;
}

export class OpenApi3ContentBuilder {
    public static defaultOpenApi3ContentBuilder(): OpenApi3ContentBuilder {
        return new OpenApi3ContentBuilder({});
    }

    private constructor(private readonly state: OpenApi3ContentBuilderState) {
    }

    public withJsonContentSchema(jsonContentSchema: any) {
        const copyOfJsonContentSchema = _.cloneDeep(jsonContentSchema);
        return new OpenApi3ContentBuilder(
            {...this.state, jsonContentSchema: copyOfJsonContentSchema, ref: undefined}
        );
    }

    public withSchemaRef(ref: string): OpenApi3ContentBuilder {
        return new OpenApi3ContentBuilder({...this.state, ref, jsonContentSchema: undefined});
    }

    public build(): OpenApi3Content {
        const content: OpenApi3Content = {};
        if (this.state.jsonContentSchema) {
            content['application/json'] = {schema: _.cloneDeep(this.state.jsonContentSchema)};
        }

        if (this.state.ref) {
            content['application/json'] = {schema: {$ref: this.state.ref}};
        }

        return content;
    }
}

export const openApi3ContentBuilder = OpenApi3ContentBuilder.defaultOpenApi3ContentBuilder();
