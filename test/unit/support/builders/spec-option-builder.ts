import {SpecOption} from '../../../../lib/api-types';
import {OpenApi3SpecBuilder} from './openapi-3-spec-builder';
import {swagger2SpecBuilder, Swagger2SpecBuilder} from './swagger-2-spec-builder';

type ContentBuilder = Swagger2SpecBuilder | OpenApi3SpecBuilder;

export class SpecOptionBuilder {
    public static defaultSpecOptionBuilder(): SpecOptionBuilder {
        return new SpecOptionBuilder('default-location.json', swagger2SpecBuilder);
    }
    private constructor(private readonly location: string, private readonly contentBuilder: ContentBuilder) {}

    public withLocation(location: string): SpecOptionBuilder {
        return new SpecOptionBuilder(location, this.contentBuilder);
    }

    public withContent(contentBuilder: ContentBuilder): SpecOptionBuilder {
        return new SpecOptionBuilder(this.location, contentBuilder);
    }

    public build(): SpecOption {
        return {
            content: this.contentBuilder.build(),
            location: this.location
        };
    }
}

export const specOptionBuilder = SpecOptionBuilder.defaultSpecOptionBuilder();
