import {SpecFormat, SpecOption} from '../../../lib/api-types';
import {OpenApi3SpecBuilder} from './openapi3-spec-builder';
import {swagger2SpecBuilder, Swagger2SpecBuilder} from './swagger2-spec-builder';

type ContentBuilder = Swagger2SpecBuilder | OpenApi3SpecBuilder;

interface SpecOptionBuilderState {
    location: string;
    content: string;
    format: SpecFormat;
}

export class SpecOptionBuilder {
    public static defaultSpecOptionBuilder(): SpecOptionBuilder {
        return new SpecOptionBuilder({
            content: JSON.stringify(swagger2SpecBuilder.build()),
            format: 'openapi3',
            location: 'default-location.json'
        });
    }

    private constructor(private readonly state: SpecOptionBuilderState) {}

    public withLocation(location: string): SpecOptionBuilder {
        return new SpecOptionBuilder({...this.state, location});
    }

    public withContent(contentBuilder: ContentBuilder): SpecOptionBuilder {
        return this.withRawContent(JSON.stringify(contentBuilder.build()));
    }

    public withRawContent(content: string): SpecOptionBuilder {
        return new SpecOptionBuilder({...this.state, content});
    }

    public withFormat(format: SpecFormat): SpecOptionBuilder {
        return new SpecOptionBuilder({...this.state, format});
    }

    public build(): SpecOption {
        return {
            content: this.state.content,
            format: this.state.format,
            location: this.state.location
        };
    }
}

export const specOptionBuilder = SpecOptionBuilder.defaultSpecOptionBuilder();
