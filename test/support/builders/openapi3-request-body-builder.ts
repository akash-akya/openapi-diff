import {OpenApi3RequestBody} from '../../../lib/openapi-diff/openapi3';
import {buildMapFromBuilders} from './builder-utils';
import {OpenApi3MediaTypeBuilder} from './openapi3-media-type-builder';

interface OpenApi3RequestBodyBuilderState {
    content: { [mediaType: string]: OpenApi3MediaTypeBuilder };
    required: boolean;
}

export class OpenApi3RequestBodyBuilder {
    public static defaultOpenApi3RequestBodyBuilder(): OpenApi3RequestBodyBuilder {
        return new OpenApi3RequestBodyBuilder({
            content: {},
            required: false
        });
    }

    private constructor(private readonly state: OpenApi3RequestBodyBuilderState) {
    }

    public withMediaType(mediaType: string, definition: OpenApi3MediaTypeBuilder): OpenApi3RequestBodyBuilder {
        const copyOfContent = {...this.state.content};
        copyOfContent[mediaType] = definition;

        return new OpenApi3RequestBodyBuilder({...this.state, content: copyOfContent});
    }

    public build(): OpenApi3RequestBody {
        const content = buildMapFromBuilders(this.state.content);
        return {
            content,
            required: this.state.required
        };
    }
}

export const openApi3RequestBodyBuilder = OpenApi3RequestBodyBuilder.defaultOpenApi3RequestBodyBuilder();
