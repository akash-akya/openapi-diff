import {Swagger2Operation, Swagger2Response, Swagger2Responses} from '../../../lib/openapi-diff/swagger2';
import {buildMapFromBuilders} from './builder-utils';
import {RefObjectBuilder} from './ref-object-builder';
import {Swagger2BodyParameterBuilder} from './swagger2-body-parameter-builder';
import {swagger2ResponseBuilder, Swagger2ResponseBuilder} from './swagger2-response-builder';

type ParameterBuilder = Swagger2BodyParameterBuilder | RefObjectBuilder;

interface Swagger2OperationBuilders {
    parameters: ParameterBuilder[];
    responses: {
        [statuscode: string]: Swagger2ResponseBuilder;
    };
}

export class Swagger2OperationBuilder {
    public static defaultSwagger2OperationBuilder(): Swagger2OperationBuilder {
        return new Swagger2OperationBuilder({
            parameters: [],
            responses: {
                200: swagger2ResponseBuilder
            }
        });
    }

    private constructor(private readonly state: Swagger2OperationBuilders) {
    }

    public withParameters(parameters: ParameterBuilder[]): Swagger2OperationBuilder {
        return new Swagger2OperationBuilder({...this.state, parameters: [...parameters]});
    }

    public withResponse(statusCode: string, responseBuilder: Swagger2ResponseBuilder): Swagger2OperationBuilder {
        const copyOfResponses = {...this.state.responses};
        copyOfResponses[statusCode] = responseBuilder;
        return new Swagger2OperationBuilder({...this.state, responses: copyOfResponses});
    }

    public build(): Swagger2Operation {
        const parameters = this.state.parameters.map((parameterBuilder) => parameterBuilder.build() as any);
        const responses: Swagger2Responses
            = buildMapFromBuilders<Swagger2ResponseBuilder, Swagger2Response>(this.state.responses);

        return {
            parameters,
            responses
        };
    }
}

export const swagger2OperationBuilder = Swagger2OperationBuilder.defaultSwagger2OperationBuilder();
