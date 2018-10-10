import {OpenApi3ResponseHeader} from '../../../lib/openapi-diff/openapi3';
import {setPropertyIfDefined} from './builder-utils';

interface OpenApi3ResponseHeaderBuilderState {
    ref?: string;
}

export class OpenApi3ResponseHeaderBuilder {
    public static defaultOpenApi3ResponseHeaderBuilder(): OpenApi3ResponseHeaderBuilder {
        return new OpenApi3ResponseHeaderBuilder({});
    }

    public constructor(private readonly state: OpenApi3ResponseHeaderBuilderState) {
    }

    public withRef(ref: string): OpenApi3ResponseHeaderBuilder {
        return new OpenApi3ResponseHeaderBuilder({...this.state, ref});
    }

    public build(): OpenApi3ResponseHeader {
        const header: OpenApi3ResponseHeader = {};

        setPropertyIfDefined(header, '$ref', this.state.ref);

        return header;
    }
}

export const openApi3ResponseHeaderBuilder = OpenApi3ResponseHeaderBuilder.defaultOpenApi3ResponseHeaderBuilder();
