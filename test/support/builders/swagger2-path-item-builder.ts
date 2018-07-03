import {Swagger2MethodNames, Swagger2PathItem} from '../../../lib/openapi-diff/swagger2';
import {Swagger2OperationBuilder} from './swagger2-operation-builder';

interface Operations {
    [method: string]: Swagger2OperationBuilder;
}

interface Swagger2PathItemBuilderState {
    operations: Operations;
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
        return Object.keys(this.state.operations)
            .reduce<Swagger2PathItem>((pathItem, currentMethod) => {
                const method = currentMethod as Swagger2MethodNames;
                pathItem[method] = this.state.operations[method].build();
                return pathItem;
            }, {});

    }
}

export const swagger2PathItemBuilder = Swagger2PathItemBuilder.defaultSwagger2PathItemBuilder();
