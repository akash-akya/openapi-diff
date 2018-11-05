import {openApi3PathItemBuilder} from './openapi3-path-item-builder';
import {OpenApi3SpecBuilder, openApi3SpecBuilder} from './openapi3-spec-builder';

export class OpenApi3SpecsDifferenceBuilder {
    public static defaultOpenApi3SpecsDifferenceBuilder(): OpenApi3SpecsDifferenceBuilder {
        return new OpenApi3SpecsDifferenceBuilder(openApi3SpecBuilder, openApi3SpecBuilder);
    }

    private constructor(
        private readonly source: OpenApi3SpecBuilder,
        private readonly destination: OpenApi3SpecBuilder) {}

    public withNonBreakingDifference(): OpenApi3SpecsDifferenceBuilder {
        return new OpenApi3SpecsDifferenceBuilder(
            this.source.withPath('/path', openApi3PathItemBuilder),
            this.destination
                .withPath('/new/path', openApi3PathItemBuilder)
                .withPath('/path', openApi3PathItemBuilder)
        );
    }

    public withUnclassifiedDifference(): OpenApi3SpecsDifferenceBuilder {
        return new OpenApi3SpecsDifferenceBuilder(
            this.source.withTopLevelXProperty('x-test-property', undefined),
            this.destination.withTopLevelXProperty('x-test-property', 'new value')
        );
    }

    public withBreakingDifference(): OpenApi3SpecsDifferenceBuilder {
        return new OpenApi3SpecsDifferenceBuilder(
            this.source.withPath('/path', openApi3PathItemBuilder),
            this.destination.withNoPaths()
        );
    }

    public build(): {source: OpenApi3SpecBuilder, destination: OpenApi3SpecBuilder} {
        return {
            destination: this.destination,
            source: this.source
        };
    }
}

export const openapi3SpecsDifferenceBuilder = OpenApi3SpecsDifferenceBuilder.defaultOpenApi3SpecsDifferenceBuilder();
