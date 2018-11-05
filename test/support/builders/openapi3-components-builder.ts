import * as _ from 'lodash';
import {
    OpenApi3Components,
    OpenApi3Reference,
    OpenApi3RequestBodies,
    OpenApi3ResponseHeaders,
    OpenApi3Responses,
    OpenApi3Schema
} from '../../../lib/openapi-diff/openapi3';
import {buildMapFromBuilders} from './builder-utils';
import {OpenApi3RequestBodyBuilder} from './openapi3-request-body-builder';
import {OpenApi3ResponseBuilder} from './openapi3-response-builder';
import {OpenApi3ResponseHeaderBuilder} from './openapi3-response-header-builder';
import {RefObjectBuilder} from './ref-object-builder';

interface OpenApi3Schemas {
    [schema: string]: OpenApi3Schema | OpenApi3Reference;
}

interface OpenApi3ComponentsBuilderState {
    headers: { [name: string]: OpenApi3ResponseHeaderBuilder };
    schemas: { [name: string]: any };
    requestBodies: { [name: string]: OpenApi3RequestBodyBuilder | RefObjectBuilder };
    responses: { [name: string]: OpenApi3ResponseBuilder | RefObjectBuilder };
}

export class OpenApi3ComponentsBuilder {
    public static defaultOpenApi3ComponentsBuilder() {
        return new OpenApi3ComponentsBuilder({
            headers: {},
            requestBodies: {},
            responses: {},
            schemas: {}
        });
    }

    private constructor(private readonly state: OpenApi3ComponentsBuilderState) {
    }

    public withHeader(name: string, definition: OpenApi3ResponseHeaderBuilder) {
        const copyOfHeaders = {...this.state.headers};
        copyOfHeaders[name] = definition;
        return new OpenApi3ComponentsBuilder({...this.state, headers: copyOfHeaders});
    }

    public withSchema(name: string, definition: any): OpenApi3ComponentsBuilder {
        const copyOfSchemas = {...this.state.schemas};
        copyOfSchemas[name] = _.cloneDeep(definition);
        return new OpenApi3ComponentsBuilder({...this.state, schemas: copyOfSchemas});
    }

    public withRequestBody(
        name: string, definition: OpenApi3RequestBodyBuilder | RefObjectBuilder
    ): OpenApi3ComponentsBuilder {
        const copyOfRequestBodies = {...this.state.requestBodies};
        copyOfRequestBodies[name] = definition;
        return new OpenApi3ComponentsBuilder({...this.state, requestBodies: copyOfRequestBodies});
    }

    public withResponse(
        name: string, definition: OpenApi3ResponseBuilder | RefObjectBuilder
    ): OpenApi3ComponentsBuilder {
        const copyOfResponses = {...this.state.responses};
        copyOfResponses[name] = definition;
        return new OpenApi3ComponentsBuilder({...this.state, responses: copyOfResponses});
    }

    public build(): OpenApi3Components {
        const headers: OpenApi3ResponseHeaders = buildMapFromBuilders(this.state.headers);
        const requestBodies: OpenApi3RequestBodies = buildMapFromBuilders(this.state.requestBodies);
        const responses: OpenApi3Responses = buildMapFromBuilders(this.state.responses);
        const schemas: OpenApi3Schemas = _.cloneDeep(this.state.schemas);

        return {
            headers,
            requestBodies,
            responses,
            schemas
        };
    }
}

export const openApi3ComponentsBuilder = OpenApi3ComponentsBuilder.defaultOpenApi3ComponentsBuilder();
