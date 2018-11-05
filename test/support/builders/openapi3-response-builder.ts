import {OpenApi3Response} from '../../../lib/openapi-diff/openapi3';
import {buildMapFromBuilders} from './builder-utils';
import {OpenApi3MediaTypeBuilder} from './openapi3-media-type-builder';
import {OpenApi3ResponseHeaderBuilder} from './openapi3-response-header-builder';

interface OpenApi3ContentBuilder {
    [mediaType: string]: OpenApi3MediaTypeBuilder;
}

interface OpenApi3HeadersBuilder {
    [name: string]: OpenApi3ResponseHeaderBuilder;
}

interface OpenApi3ResponseBuilderState {
    description: string;
    content?: OpenApi3ContentBuilder;
    headers?: OpenApi3HeadersBuilder;
}

export class OpenApi3ResponseBuilder {
    public static defaultOpenApi3ResponseBuilder(): OpenApi3ResponseBuilder {
        return new OpenApi3ResponseBuilder({
            description: 'default description'
        });
    }

    private constructor(private readonly state: OpenApi3ResponseBuilderState) {
    }

    public withHeader(name: string, definition: OpenApi3ResponseHeaderBuilder): OpenApi3ResponseBuilder {
        const copyOfHeaders: OpenApi3HeadersBuilder = {...this.state.headers};
        copyOfHeaders[name] = definition;

        return new OpenApi3ResponseBuilder({...this.state, headers: copyOfHeaders});
    }

    public withMediaType(mediaType: string, definition: OpenApi3MediaTypeBuilder): OpenApi3ResponseBuilder {
        const copyOfContent: OpenApi3ContentBuilder = {...this.state.content};
        copyOfContent[mediaType] = definition;

        return new OpenApi3ResponseBuilder({...this.state, content: copyOfContent});
    }

    public build(): OpenApi3Response {
        const response: OpenApi3Response = {
            description: this.state.description
        };

        if (this.state.content) {
            response.content = buildMapFromBuilders(this.state.content);
        }

        if (this.state.headers) {
            response.headers = buildMapFromBuilders(this.state.headers);
        }

        return response;
    }
}

export const openApi3ResponseBuilder = OpenApi3ResponseBuilder.defaultOpenApi3ResponseBuilder();
