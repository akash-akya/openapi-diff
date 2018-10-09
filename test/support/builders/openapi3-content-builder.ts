import {OpenApi3Response} from '../../../lib/openapi-diff/openapi3';
import {setPropertyFromBuilderIfDefined} from './builder-utils';
import {OpenApi3ResponseContentBuilder} from './openapi3-response-content-builder';

interface OpenApi3ContentBuilderState {
    description: string;
    content?: OpenApi3ResponseContentBuilder;
}

export class OpenApi3ContentBuilder {
    public static defaultOpenApi3ContentBuilder(): OpenApi3ContentBuilder {
        return new OpenApi3ContentBuilder({
            description: 'default description'
        });
    }

    private constructor(private readonly state: OpenApi3ContentBuilderState) {
    }

    public withNoResponseBody(): OpenApi3ContentBuilder {
        return new OpenApi3ContentBuilder({...this.state, content: undefined});
    }

    public withResponseBody(responseContent: OpenApi3ResponseContentBuilder): OpenApi3ContentBuilder {
        return new OpenApi3ContentBuilder({...this.state, content: responseContent});
    }

    public build(): OpenApi3Response {
        const response: OpenApi3Response = {
            description: this.state.description
        };

        setPropertyFromBuilderIfDefined(response, 'content', this.state.content);

        return response;
    }
}

export const openapi3ContentBuilder = OpenApi3ContentBuilder.defaultOpenApi3ContentBuilder();
