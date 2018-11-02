import * as _ from 'lodash';
import {Swagger2Response, Swagger2Schema} from '../../../lib/openapi-diff/swagger2';
import {buildMapFromBuilders, setPropertyIfDefined} from './builder-utils';
import {Swagger2ResponseHeaderBuilder} from './swagger2-response-header-builder';

interface Swagger2ResponseHeadersBuilder {
    [name: string]: Swagger2ResponseHeaderBuilder;
}

interface Swagger2ResponseBuilderState {
    description: string;
    headers?: Swagger2ResponseHeadersBuilder;
    schema?: Swagger2Schema;
}

export class Swagger2ResponseBuilder {
    public static defaultSwagger2ResponseBuilder(): Swagger2ResponseBuilder {
        return new Swagger2ResponseBuilder({
            description: 'default description'
        });
    }

    private constructor(private readonly state: Swagger2ResponseBuilderState) {
    }

    public withHeader(name: string, definition: Swagger2ResponseHeaderBuilder): Swagger2ResponseBuilder {
        const copyOfHeaders: Swagger2ResponseHeadersBuilder = {...this.state.headers};
        copyOfHeaders[name] = definition;
        return new Swagger2ResponseBuilder({...this.state, headers: copyOfHeaders});
    }

    public withResponseBody(responseBody: Swagger2Schema): Swagger2ResponseBuilder {
        const copyOfResponseBody = _.cloneDeep(responseBody);
        return new Swagger2ResponseBuilder({...this.state, schema: copyOfResponseBody});
    }

    public withSchemaRef($ref: string): Swagger2ResponseBuilder {
        return this.withResponseBody({$ref});
    }

    public build(): Swagger2Response {
        const response: Swagger2Response = {
            description: this.state.description
        };

        setPropertyIfDefined(response, 'schema', this.state.schema);

        if (this.state.headers) {
            response.headers = buildMapFromBuilders(this.state.headers);
        }

        return response;
    }
}

export const swagger2ResponseBuilder = Swagger2ResponseBuilder.defaultSwagger2ResponseBuilder();
