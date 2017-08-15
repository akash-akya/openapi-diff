import * as _ from 'lodash';

import { InfoObject } from 'openapi3-ts'; // TODO: swagger 2 types have no Xprops?

export class GenericSpecInfoBuilder {
    private specInfo: InfoObject;

    constructor(specInfo: InfoObject) {
        this.specInfo = specInfo;
    }

    public build(): InfoObject {
        return _.cloneDeep(this.specInfo);
    }

    public withTitle(value: string): GenericSpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.title = copyOfValue;
        return new GenericSpecInfoBuilder(copyOfSpecInfo);
    }

    public withVersion(value: string): GenericSpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.version = copyOfValue;
        return new GenericSpecInfoBuilder(copyOfSpecInfo);
    }

    public withXProperty(name: string, value: any) {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo[name] = copyOfValue;
        return new GenericSpecInfoBuilder(copyOfSpecInfo);
    }
}

const defaultSpecInfo = {
    title: 'spec title',
    version: 'spec version'
};

export const genericSpecInfoBuilder = new GenericSpecInfoBuilder(defaultSpecInfo);
