import * as _ from 'lodash';
import {OperationObject as OpenApi3Operation} from 'openapi3-ts';

const defaultOpenApi3Operation: OpenApi3Operation = {
    responses: {}
};

export class OpenApi3OperationBuilder {
    public static defaultOpenApi3OperationBuilder(): OpenApi3OperationBuilder {
        return new OpenApi3OperationBuilder(defaultOpenApi3Operation);
    }

    private constructor(private readonly openApi3Operation: OpenApi3Operation) {}

    public build(): OpenApi3Operation {
        return _.cloneDeep(this.openApi3Operation);
    }
}

export const openApi3OperationBuilder = OpenApi3OperationBuilder.defaultOpenApi3OperationBuilder();
