import {SpecDetails, SpecFormat} from '../../../lib/api-types';

export class SpecDetailsBuilder {
    public static defaultSpecDetailsBuilder(): SpecDetailsBuilder {
        return new SpecDetailsBuilder('default-location', 'swagger2');
    }

    private constructor(private readonly location: string, private readonly format: SpecFormat) {}

    public withLocation(location: string): SpecDetailsBuilder {
        return new SpecDetailsBuilder(location, this.format);
    }

    public withFormat(format: SpecFormat): SpecDetailsBuilder {
        return new SpecDetailsBuilder(this.location, format);
    }
    public build(): SpecDetails {
        return {
            format: this.format,
            location: this.location
        };
    }
}

export const specDetailsBuilder = SpecDetailsBuilder.defaultSpecDetailsBuilder();
