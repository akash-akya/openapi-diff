import {DiffResultSpecEntityDetails} from '../../../lib/api-types';

interface SpecEntityDetailsState {
    location: string | undefined;
    value: any;
}

export class DiffResultSpecEntityDetailsBuilder {

    public static defaultSpecEntityDetailsBuilder() {
        return new DiffResultSpecEntityDetailsBuilder({
            location: 'default-location',
            value: 'default-value'
        });
    }

    private constructor(private readonly state: SpecEntityDetailsState) {}

    public withLocation(location: string | undefined): DiffResultSpecEntityDetailsBuilder {
        return new DiffResultSpecEntityDetailsBuilder({
            location,
            value: this.state.value
        });
    }

    public withValue(value: any | undefined): DiffResultSpecEntityDetailsBuilder {
        return new DiffResultSpecEntityDetailsBuilder({
            location: this.state.location,
            value
        });
    }

    public build(): DiffResultSpecEntityDetails {
        return {
            location: this.state.location,
            value: this.state.value
        };
    }
}

export const specEntityDetailsBuilder = DiffResultSpecEntityDetailsBuilder.defaultSpecEntityDetailsBuilder();
