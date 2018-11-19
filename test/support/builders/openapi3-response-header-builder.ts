import {OpenApi3ResponseHeader} from '../../../lib/openapi-diff/openapi3';
import {setPropertyIfDefined} from './builder-utils';

interface OpenApi3ResponseHeaderBuilderState {
    ref?: string;
    required?: boolean;
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

    public withNoRequiredValue(): OpenApi3ResponseHeaderBuilder {
        return new OpenApi3ResponseHeaderBuilder({...this.state, required: undefined});
    }

    public withRequiredValue(required: boolean): OpenApi3ResponseHeaderBuilder {
        return new OpenApi3ResponseHeaderBuilder({...this.state, required});
    }

    public build(): OpenApi3ResponseHeader {
        const header: OpenApi3ResponseHeader = {};

        setPropertyIfDefined(header, '$ref', this.state.ref);
        setPropertyIfDefined(header, 'required', this.state.required);

        return header;
    }
}

export const openApi3ResponseHeaderBuilder = OpenApi3ResponseHeaderBuilder.defaultOpenApi3ResponseHeaderBuilder();
