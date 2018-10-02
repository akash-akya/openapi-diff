import * as _ from 'lodash';
import {OpenApi3Content} from '../../../lib/openapi-diff/openapi3';

interface OpenApi3ResponseContentBuilderState {
    jsonContentSchema?: any;
    ref?: string;
}

export class OpenApi3ResponseContentBuilder {
    public static defaultOpenApi3ResponseContentBuilder(): OpenApi3ResponseContentBuilder {
        return new OpenApi3ResponseContentBuilder({});
    }

    private constructor(private readonly state: OpenApi3ResponseContentBuilderState) {
    }

    public withJsonContentSchema(jsonContentSchema: any) {
        const copyOfJsonContentSchema = _.cloneDeep(jsonContentSchema);
        return new OpenApi3ResponseContentBuilder(
            {...this.state, jsonContentSchema: copyOfJsonContentSchema}
        );
    }

    public withSchemaRef(ref: string): OpenApi3ResponseContentBuilder {
        return new OpenApi3ResponseContentBuilder({...this.state, ref, jsonContentSchema: undefined});
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

export const openApi3ResponseContentBuilder = OpenApi3ResponseContentBuilder.defaultOpenApi3ResponseContentBuilder();
