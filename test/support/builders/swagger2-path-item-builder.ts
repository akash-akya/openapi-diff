import {Swagger2MethodNames, Swagger2Operation, Swagger2PathItem} from '../../../lib/openapi-diff/swagger2';
import {buildMapFromBuilders} from './builder-utils';
import {Swagger2OperationBuilder} from './swagger2-operation-builder';

interface OperationsStateBuilder {
    [method: string]: Swagger2OperationBuilder;
}

interface Swagger2PathItemBuilderState {
    operations: OperationsStateBuilder;
}

export class Swagger2PathItemBuilder {
    public static defaultSwagger2PathItemBuilder(): Swagger2PathItemBuilder {
        return new Swagger2PathItemBuilder({operations: {}});
    }

    private constructor(private readonly state: Swagger2PathItemBuilderState) {}

    public withOperation(
        operationName: Swagger2MethodNames, operationBuilder: Swagger2OperationBuilder
    ): Swagger2PathItemBuilder {
        const copyOfOperations = {...this.state.operations};
        copyOfOperations[operationName] = operationBuilder;
        return new Swagger2PathItemBuilder({...this.state, operations: copyOfOperations});
    }

    public build(): Swagger2PathItem {
        return buildMapFromBuilders<Swagger2OperationBuilder, Swagger2Operation>(this.state.operations);
    }
}

export const swagger2PathItemBuilder = Swagger2PathItemBuilder.defaultSwagger2PathItemBuilder();
