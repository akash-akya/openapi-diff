import {ValidationResultSpecEntityDetails} from '../../../../lib/api-types';

interface SpecEntityDetailsState {
    location: string;
    pathMethod: string | null;
    pathName: string | null;
    value: any;
}

export class ValidationResultSpecEntityDetailsBuilder {

    public static defaultSpecEntityDetailsBuilder() {
        return new ValidationResultSpecEntityDetailsBuilder({
            location: 'default-location',
            pathMethod: null,
            pathName: null,
            value: 'default-value'
        });
    }

    private constructor(private readonly state: SpecEntityDetailsState) {}

    public withLocation(location: string): ValidationResultSpecEntityDetailsBuilder {
        return new ValidationResultSpecEntityDetailsBuilder({
            location,
            pathMethod: this.state.pathMethod,
            pathName: this.state.pathName,
            value: this.state.value
        });
    }

    public withValue(value: any | undefined): ValidationResultSpecEntityDetailsBuilder {
        return new ValidationResultSpecEntityDetailsBuilder({
            location: this.state.location,
            pathMethod: this.state.pathMethod,
            pathName: this.state.pathName,
            value
        });
    }

    public build(): ValidationResultSpecEntityDetails {
        return {
            location: this.state.location,
            pathMethod: this.state.pathMethod,
            pathName: this.state.pathName,
            value: this.state.value
        };
    }
}

export const specEntityDetailsBuilder = ValidationResultSpecEntityDetailsBuilder.defaultSpecEntityDetailsBuilder();
