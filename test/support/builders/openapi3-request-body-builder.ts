import {OpenApi3RequestBody} from '../../../lib/openapi-diff/openapi3';
import {openApi3ContentBuilder, OpenApi3ContentBuilder} from './openapi3-content-builder';

interface OpenApi3RequestBodyBuilderState {
    required: boolean;
    content: OpenApi3ContentBuilder;
}

export class OpenApi3RequestBodyBuilder {
    public static defaultOpenApi3RequestBodyBuilder(): OpenApi3RequestBodyBuilder {
        return new OpenApi3RequestBodyBuilder({
            content: openApi3ContentBuilder,
            required: false
        });
    }

    private constructor(private readonly state: OpenApi3RequestBodyBuilderState) {
    }

    public withContent(content: OpenApi3ContentBuilder): OpenApi3RequestBodyBuilder {
        return new OpenApi3RequestBodyBuilder({...this.state, content});
    }

    public build(): OpenApi3RequestBody {
        return {
            content: this.state.content.build(),
            required: this.state.required
        };
    }
}

export const openApi3RequestBodyBuilder = OpenApi3RequestBodyBuilder.defaultOpenApi3RequestBodyBuilder();
