import {SpecOption} from '../../../lib/api-types';
import {OpenApi3SpecBuilder} from './openapi-3-spec-builder';
import {swagger2SpecBuilder, Swagger2SpecBuilder} from './swagger-2-spec-builder';

type ContentBuilder = Swagger2SpecBuilder | OpenApi3SpecBuilder;

export class SpecOptionBuilder {
    public static defaultSpecOptionBuilder(): SpecOptionBuilder {
        return new SpecOptionBuilder('default-location.json', JSON.stringify(swagger2SpecBuilder.build()));
    }
    private constructor(private readonly location: string, private readonly content: string) {}

    public withLocation(location: string): SpecOptionBuilder {
        return new SpecOptionBuilder(location, this.content);
    }

    public withContent(contentBuilder: ContentBuilder): SpecOptionBuilder {
        return this.withRawContent(JSON.stringify(contentBuilder.build()));
    }

    public withRawContent(content: string): SpecOptionBuilder {
        return new SpecOptionBuilder(this.location, content);
    }

    public build(): SpecOption {
        return {
            content: this.content,
            location: this.location
        };
    }
}

export const specOptionBuilder = SpecOptionBuilder.defaultSpecOptionBuilder();
