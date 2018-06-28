import {swagger2SpecBuilder, Swagger2SpecBuilder} from './swagger-2-spec-builder';

export class Swagger2SpecsDifferenceBuilder {
    public static defaultSwagger2SpecsDifferenceBuilder(): Swagger2SpecsDifferenceBuilder {
        return new Swagger2SpecsDifferenceBuilder(swagger2SpecBuilder, swagger2SpecBuilder);
    }

    private constructor(
        private readonly source: Swagger2SpecBuilder,
        private readonly destination: Swagger2SpecBuilder) {}

    public withNonBreakingDifference(): Swagger2SpecsDifferenceBuilder {
        return new Swagger2SpecsDifferenceBuilder(
            this.source.withSchemes(['http']),
            this.destination.withSchemes(['http', 'https'])
        );
    }

    public withUnclassifiedDifference(): Swagger2SpecsDifferenceBuilder {
        return new Swagger2SpecsDifferenceBuilder(
            this.source.withTopLevelXProperty({key: 'x-test-property', value: undefined}),
            this.destination.withTopLevelXProperty({key: 'x-test-property', value: 'new value'})
        );
    }

    public withBreakingDifference(): Swagger2SpecsDifferenceBuilder {
        return new Swagger2SpecsDifferenceBuilder(
            this.source.withSchemes(['http', 'https']),
            this.destination.withSchemes(['http'])
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
