import {OpenApi3MethodName, OpenApi3Operation, OpenApi3PathItem} from '../../../lib/openapi-diff/openapi3';
import {buildMapFromBuilders, setPropertyIfDefined} from './builder-utils';
import {OpenApi3OperationBuilder} from './openapi3-operation-builder';

interface OperationsBuilderState {
    [method: string]: OpenApi3OperationBuilder;
}

interface OpenApi3PathItemBuilderState {
    operations: OperationsBuilderState;
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
        const operations: OpenApi3PathItem =
            buildMapFromBuilders<OpenApi3OperationBuilder, OpenApi3Operation>(this.state.operations);

        setPropertyIfDefined(operations, 'description', this.state.description);

        return operations;
    }
}

export const openApi3PathItemBuilder = OpenApi3PathItemBuilder.defaultOpenApi3PathItemBuilder();
