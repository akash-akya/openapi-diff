import * as _ from 'lodash';
import {Swagger2Response, Swagger2Schema} from '../../../lib/openapi-diff/swagger2';

interface Swagger2ResponseBuilderState {
    description: string;
    schema?: Swagger2Schema;
    ref?: string;
}

export class Swagger2ResponseBuilder {
    public static defaultSwagger2ResponseBuilder(): Swagger2ResponseBuilder {
        return new Swagger2ResponseBuilder({
            description: 'default description'
        });
    }

    private constructor(private readonly state: Swagger2ResponseBuilderState) {
    }

    public withResponseBody(responseBody: Swagger2Schema): Swagger2ResponseBuilder {
        const copyOfResponseBody = _.cloneDeep(responseBody);
        return new Swagger2ResponseBuilder({...this.state, schema: copyOfResponseBody});
    }

    public withSchemaRef(ref: string): Swagger2ResponseBuilder {
        return new Swagger2ResponseBuilder({...this.state, ref, schema: undefined});
    }

    public build(): Swagger2Response {
        const response: Swagger2Response = {
            description: this.state.description
        };

        if (this.state.schema) {
            response.schema = _.cloneDeep(this.state.schema);
        }

        if (this.state.ref) {
            response.schema = {$ref: this.state.ref};
        }

        return response;
    }
}

export const swagger2ResponseBuilder = Swagger2ResponseBuilder.defaultSwagger2ResponseBuilder();
