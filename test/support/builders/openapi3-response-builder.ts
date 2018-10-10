import {OpenApi3Response} from '../../../lib/openapi-diff/openapi3';
import {buildMapFromBuilders, setPropertyFromBuilderIfDefined} from './builder-utils';
import {OpenApi3ResponseContentBuilder} from './openapi3-response-content-builder';
import {OpenApi3ResponseHeaderBuilder} from './openapi3-response-header-builder';

interface OpenApi3HeadersBuilder {
    [name: string]: OpenApi3ResponseHeaderBuilder;
}

interface OpenApi3ResponseBuilderState {
    description: string;
    content?: OpenApi3ResponseContentBuilder;
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

    public withNoResponseBody(): OpenApi3ResponseBuilder {
        return new OpenApi3ResponseBuilder({...this.state, content: undefined});
    }

    public withResponseBody(responseContent: OpenApi3ResponseContentBuilder): OpenApi3ResponseBuilder {
        return new OpenApi3ResponseBuilder({...this.state, content: responseContent});
    }

    public build(): OpenApi3Response {
        const response: OpenApi3Response = {
            description: this.state.description
        };

        setPropertyFromBuilderIfDefined(response, 'content', this.state.content);

        if (this.state.headers) {
            response.headers = buildMapFromBuilders(this.state.headers);
        }

        return response;
    }
}

export const openApi3ResponseBuilder = OpenApi3ResponseBuilder.defaultOpenApi3ResponseBuilder();
