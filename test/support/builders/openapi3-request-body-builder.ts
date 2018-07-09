import * as _ from 'lodash';
import {ContentObject, RequestBodyObject as OpenaApi3RequestBody} from 'openapi3-ts';

interface OpenApi3RequestBodyBuilderState {
    required: boolean;
    jsonContentSchema?: any;
    ref?: string;
}

export class OpenApi3RequestBodyBuilder {
    public static defaultOpenApi3OperationBuilder(): OpenApi3RequestBodyBuilder {
        return new OpenApi3RequestBodyBuilder({
            required: false
        });
    }

    private constructor(private readonly state: OpenApi3RequestBodyBuilderState) {}

    public withJsonContentSchema(jsonContentSchema: any) {
        const copyOfJsonContentSchema = _.cloneDeep(jsonContentSchema);
        return new OpenApi3RequestBodyBuilder(
            {...this.state, jsonContentSchema: copyOfJsonContentSchema, ref: undefined}
        );
    }

    public withSchemaRef(ref: string): OpenApi3RequestBodyBuilder {
        return new OpenApi3RequestBodyBuilder({...this.state, ref, jsonContentSchema: undefined});
    }

    public build(): OpenaApi3RequestBody {
        const content: ContentObject = {};
        if (this.state.jsonContentSchema) {
            content['application/json'] = {schema: _.cloneDeep(this.state.jsonContentSchema)};
        }

        if (this.state.ref) {
            content['application/json'] = {schema: {$ref: this.state.ref}};
        }
        return {
            content,
            required: this.state.required
        };
    }
}

export const openApi3RequestBodyBuilder = OpenApi3RequestBodyBuilder.defaultOpenApi3OperationBuilder();
