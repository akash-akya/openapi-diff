import {OperationObject as OpenApi3Operation, ResponsesObject as OpenApi3ResponsesObject} from 'openapi3-ts';
import {OpenApi3RequestBodyBuilder} from './openapi3-request-body-builder';
import {OpenApi3ResponseBuilder} from './openapi3-response-builder';
import {RefObjectBuilder} from './ref-object-builder';

interface OpenApi3OperationBuilderState {
    responses: {
        [statuscode: string]: OpenApi3ResponseBuilder
    };
    requestBody?: OpenApi3RequestBodyBuilder | RefObjectBuilder;
}

export class OpenApi3OperationBuilder {
    public static defaultOpenApi3OperationBuilder(): OpenApi3OperationBuilder {
        return new OpenApi3OperationBuilder({
            responses: {}
        });
    }

    private constructor(private readonly state: OpenApi3OperationBuilderState) {
    }

    public withRequestBody(
        requestBody: OpenApi3RequestBodyBuilder | RefObjectBuilder
    ): OpenApi3OperationBuilder {
        return new OpenApi3OperationBuilder({...this.state, requestBody});
    }

    public withNoRequestBody(): OpenApi3OperationBuilder {
        return new OpenApi3OperationBuilder({...this.state, requestBody: undefined});
    }

    public withResponse(
        responseStatusCode: string,
        responseBuilder: OpenApi3ResponseBuilder
    ): OpenApi3OperationBuilder {
        const copyOfResponses = {...this.state.responses};
        copyOfResponses[responseStatusCode] = responseBuilder;
        return new OpenApi3OperationBuilder({...this.state, responses: copyOfResponses});
    }

    public build(): OpenApi3Operation {
        const responses: OpenApi3ResponsesObject =
            Object.keys(this.state.responses).reduce<OpenApi3ResponsesObject>((accumulator, statusCode) => {
                accumulator[statusCode] = this.state.responses[statusCode].build();
                return accumulator;
            }, {});

        const operation: OpenApi3Operation = {
            responses
        };

        return this.state.requestBody ? {...operation, requestBody: this.state.requestBody.build()} : operation;
    }
}

export const openApi3OperationBuilder = OpenApi3OperationBuilder.defaultOpenApi3OperationBuilder();
