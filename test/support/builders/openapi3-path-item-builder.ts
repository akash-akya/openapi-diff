import {PathItemObject as OpenApi3PathItem} from 'openapi3-ts';
import {OpenApi3MethodName} from '../../../lib/openapi-diff/openapi3';
import {OpenApi3OperationBuilder} from './openapi3-operation-builder';

interface Operations {
    [method: string]: OpenApi3OperationBuilder;
}

interface OpenApi3PathItemBuilderState {
    operations: Operations;
    description?: string;
}

export class OpenApi3PathItemBuilder {
    public static defaultOpenApi3PathItemBuilder(): OpenApi3PathItemBuilder {
        return new OpenApi3PathItemBuilder({
            operations: {}
        });
    }

    private constructor(private readonly state: OpenApi3PathItemBuilderState) {}

    public withOperation(
        operationName: OpenApi3MethodName,
        operationBuilder: OpenApi3OperationBuilder
    ): OpenApi3PathItemBuilder {
        const copyOfOperations = {...this.state.operations};
        copyOfOperations[operationName] = operationBuilder;
        return new OpenApi3PathItemBuilder({...this.state, operations: copyOfOperations});
    }

    public withNoOperations(): OpenApi3PathItemBuilder {
        return new OpenApi3PathItemBuilder({...this.state, operations: {}});
    }

    public withDescription(description: string | undefined): OpenApi3PathItemBuilder {
        return new OpenApi3PathItemBuilder({...this.state, description});
    }

    public build(): OpenApi3PathItem {
        const operations = Object.keys(this.state.operations)
            .reduce<OpenApi3PathItem>((pathItem, currentMethod) => {
                pathItem[currentMethod] = this.state.operations[currentMethod].build();
                return pathItem;
            }, {});

        return this.state.description ? {...operations, description: this.state.description} : operations;
    }
}

export const openApi3PathItemBuilder = OpenApi3PathItemBuilder.defaultOpenApi3PathItemBuilder();
