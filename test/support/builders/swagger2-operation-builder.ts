import * as _ from 'lodash';
import {Swagger2Operation} from '../../../lib/openapi-diff/swagger2';
import {RefObjectBuilder} from './ref-object-builder';
import {Swagger2BodyParameterBuilder} from './swagger2-body-parameter-builder';

const defaultSwagger2Operation: Swagger2Operation = {
    responses: {
        200: {description: 'default description'}
    }
};

type ParameterBuilder = Swagger2BodyParameterBuilder | RefObjectBuilder;

interface Swagger2OperationBuilderState {
    parameters: ParameterBuilder[];
}

export class Swagger2OperationBuilder {
    public static defaultSwagger2OperationBuilder(): Swagger2OperationBuilder {
        return new Swagger2OperationBuilder({parameters: []});
    }

    private constructor(private readonly state: Swagger2OperationBuilderState) {}

    public withParameters(parameters: ParameterBuilder[]): Swagger2OperationBuilder {
        return new Swagger2OperationBuilder({...this.state, parameters: [...parameters]});
    }

    public build(): Swagger2Operation {
        const operation =  _.cloneDeep(defaultSwagger2Operation);
        operation.parameters = this.state.parameters.map((parameterBuilder) => parameterBuilder.build() as any);
        return operation;
    }
}

export const swagger2OperationBuilder = Swagger2OperationBuilder.defaultSwagger2OperationBuilder();
