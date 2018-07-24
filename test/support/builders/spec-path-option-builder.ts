import {SpecFormatOrAuto, SpecReference} from '../../../lib/openapi-diff';

export class SpecPathOptionBuilder {
    public static defaultSpecPathOptionBuilder(): SpecPathOptionBuilder {
        return new SpecPathOptionBuilder('default-location.json', 'auto-detect');
    }

    private constructor(private readonly location: string, private readonly format: SpecFormatOrAuto) {}

    public withLocation(location: string): SpecPathOptionBuilder {
        return new SpecPathOptionBuilder(location, this.format);
    }

    public withFormat(format: SpecFormatOrAuto): SpecPathOptionBuilder {
        return new SpecPathOptionBuilder(this.location, format);
    }

    public build(): SpecReference {
        return {
            format: this.format,
            location: this.location
        };
    }
}

export const specPathOptionBuilder = SpecPathOptionBuilder.defaultSpecPathOptionBuilder();
