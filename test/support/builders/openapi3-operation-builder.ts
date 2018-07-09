import * as _ from 'lodash';
import {OperationObject as OpenApi3Operation} from 'openapi3-ts';
import {OpenApi3RequestBodyBuilder} from './openapi3-request-body-builder';
import {RefObjectBuilder} from './ref-object-builder';

interface OpenApi3OperationBuilderState {
    responses: object;
    requestBody?: OpenApi3RequestBodyBuilder | RefObjectBuilder;
}

export class OpenApi3OperationBuilder {
    public static defaultOpenApi3OperationBuilder(): OpenApi3OperationBuilder {
        return new OpenApi3OperationBuilder({
            responses: {
                200: {
                    description: 'default description'
                }
            }
        });
    }

    private constructor(private readonly state: OpenApi3OperationBuilderState) {}

    public withRequestBody(
        requestBody: OpenApi3RequestBodyBuilder | RefObjectBuilder
    ): OpenApi3OperationBuilder {
        return new OpenApi3OperationBuilder({...this.state, requestBody});
    }

    public withNoRequestBody(): OpenApi3OperationBuilder {
        return new OpenApi3OperationBuilder({...this.state, requestBody: undefined});
    }

    public build(): OpenApi3Operation {
        const operation: OpenApi3Operation = {
            responses: _.cloneDeep(this.state.responses)
        };

        return this.state.requestBody ? {...operation, requestBody: this.state.requestBody.build()} : operation;
    }
}

export const openApi3OperationBuilder = OpenApi3OperationBuilder.defaultOpenApi3OperationBuilder();
