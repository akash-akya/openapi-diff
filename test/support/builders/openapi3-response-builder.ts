import {ResponseObject as OpenApi3Response} from 'openapi3-ts';

interface OpenApi3ResponseBuilderState {
    description: string;
}

export class OpenApi3ResponseBuilder {
    public static defaultOpenApi3ResponseBuilder(): OpenApi3ResponseBuilder {
        return new OpenApi3ResponseBuilder({
            description: 'default description'
        });
    }

    private constructor(private readonly state: OpenApi3ResponseBuilderState) {
    }

    public build(): OpenApi3Response {
        return {
            description: this.state.description
        };
    }
}

export const openApi3ResponseBuilder = OpenApi3ResponseBuilder.defaultOpenApi3ResponseBuilder();
