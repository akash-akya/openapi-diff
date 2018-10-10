import {OpenApi3Operation, OpenApi3Responses} from '../../../lib/openapi-diff/openapi3';
import {buildMapFromBuilders, setPropertyFromBuilderIfDefined} from './builder-utils';
import {OpenApi3RequestBodyBuilder} from './openapi3-request-body-builder';
import {OpenApi3ResponseBuilder} from './openapi3-response-builder';
import {RefObjectBuilder} from './ref-object-builder';

interface OperationBuilders {
    responses: {
        [statuscode: string]: OpenApi3ResponseBuilder | RefObjectBuilder
    };
    requestBody?: OpenApi3RequestBodyBuilder | RefObjectBuilder;
}

export class OpenApi3OperationBuilder {
    public static defaultOpenApi3OperationBuilder(): OpenApi3OperationBuilder {
        return new OpenApi3OperationBuilder({
            responses: {}
        });
    }

    private constructor(private readonly state: OperationBuilders) {
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
        responseBuilder: OpenApi3ResponseBuilder | RefObjectBuilder
    ): OpenApi3OperationBuilder {
        const copyOfResponses = {...this.state.responses};
        copyOfResponses[responseStatusCode] = responseBuilder;
        return new OpenApi3OperationBuilder({...this.state, responses: copyOfResponses});
    }

    public build(): OpenApi3Operation {
        const responses: OpenApi3Responses = buildMapFromBuilders(this.state.responses);
        const operation: OpenApi3Operation = {
            responses
        };

        setPropertyFromBuilderIfDefined(operation, 'requestBody', this.state.requestBody);

        return operation;
    }
}

export const openApi3OperationBuilder = OpenApi3OperationBuilder.defaultOpenApi3OperationBuilder();
