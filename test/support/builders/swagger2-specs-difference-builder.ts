import {swagger2PathItemBuilder} from './swagger2-path-item-builder';
import {swagger2SpecBuilder, Swagger2SpecBuilder} from './swagger2-spec-builder';

export class Swagger2SpecsDifferenceBuilder {
    public static defaultSwagger2SpecsDifferenceBuilder(): Swagger2SpecsDifferenceBuilder {
        return new Swagger2SpecsDifferenceBuilder(swagger2SpecBuilder, swagger2SpecBuilder);
    }

    private constructor(
        private readonly source: Swagger2SpecBuilder,
        private readonly destination: Swagger2SpecBuilder) {}

    public withNonBreakingDifference(): Swagger2SpecsDifferenceBuilder {
        return new Swagger2SpecsDifferenceBuilder(
            this.source.withPath('/path', swagger2PathItemBuilder),
            this.destination
                .withPath('/new/path', swagger2PathItemBuilder)
                .withPath('/path', swagger2PathItemBuilder)
        );
    }

    public withUnclassifiedDifference(): Swagger2SpecsDifferenceBuilder {
        return new Swagger2SpecsDifferenceBuilder(
            this.source.withTopLevelXProperty('x-test-property', undefined),
            this.destination.withTopLevelXProperty('x-test-property', 'new value')
        );
    }

    public withBreakingDifference(): Swagger2SpecsDifferenceBuilder {
        return new Swagger2SpecsDifferenceBuilder(
            this.source.withPath('/path', swagger2PathItemBuilder),
            this.destination.withNoPaths()
        );
    }

    public build(): {source: Swagger2SpecBuilder, destination: Swagger2SpecBuilder} {
        return {
            destination: this.destination,
            source: this.source
        };
    }
}

export const swagger2SpecsDifferenceBuilder = Swagger2SpecsDifferenceBuilder.defaultSwagger2SpecsDifferenceBuilder();
