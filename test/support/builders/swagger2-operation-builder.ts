import * as _ from 'lodash';
import {Swagger2Operation} from '../../../lib/openapi-diff/swagger2';

const defaultSwagger2Operation: Swagger2Operation = {
    responses: {
        200: {description: 'default description'}
    }
};

export class Swagger2OperationBuilder {
    public static defaultSwagger2OperationBuilder(): Swagger2OperationBuilder {
        return new Swagger2OperationBuilder(defaultSwagger2Operation);
    }

    private constructor(private readonly swagger2Operation: Swagger2Operation) {}

    public build(): Swagger2Operation {
        return _.cloneDeep(this.swagger2Operation);
    }
}

export const swagger2OperationBuilder = Swagger2OperationBuilder.defaultSwagger2OperationBuilder();
