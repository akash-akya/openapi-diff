import * as _ from 'lodash';
import {DiffResultSpecEntityDetails} from '../../../lib/api-types';

interface SpecEntityDetailsState {
    location: string;
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

    public withLocation(location: string): DiffResultSpecEntityDetailsBuilder {
        return new DiffResultSpecEntityDetailsBuilder({...this.state, location});
    }

    public withValue(value: any): DiffResultSpecEntityDetailsBuilder {
        return new DiffResultSpecEntityDetailsBuilder({...this.state, value: _.cloneDeep(value)});
    }

    public build(): DiffResultSpecEntityDetails {
        return {
            location: this.state.location,
            value: _.cloneDeep(this.state.value)
        };
    }
}

export const specEntityDetailsBuilder = DiffResultSpecEntityDetailsBuilder.defaultSpecEntityDetailsBuilder();
