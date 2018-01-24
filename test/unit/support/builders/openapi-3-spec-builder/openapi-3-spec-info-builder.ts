import * as _ from 'lodash';

import {InfoObject} from 'openapi3-ts';

export class OpenApi3SpecInfoBuilder {
    constructor(private readonly specInfo: InfoObject) {
    }

    public build(): InfoObject {
        return _.cloneDeep(this.specInfo);
    }

    public withContact(email: string, name: string, url: string): OpenApi3SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfEmail = _.cloneDeep(email);
        const copyOfName = _.cloneDeep(name);
        const copyOfUrl = _.cloneDeep(url);
        copyOfSpecInfo.contact = {
            email: copyOfEmail,
            name: copyOfName,
            url: copyOfUrl
        };
        return new OpenApi3SpecInfoBuilder(copyOfSpecInfo);
    }

    public withDescription(value: string): OpenApi3SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.description = copyOfValue;
        return new OpenApi3SpecInfoBuilder(copyOfSpecInfo);
    }

    public withLicense(name: string, url: string): OpenApi3SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfName = _.cloneDeep(name);
        const copyOfUrl = _.cloneDeep(url);
        copyOfSpecInfo.license = {
            name: copyOfName,
            url: copyOfUrl
        };
        return new OpenApi3SpecInfoBuilder(copyOfSpecInfo);
    }

    public withTermsOfService(value: string): OpenApi3SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.termsOfService = copyOfValue;
        return new OpenApi3SpecInfoBuilder(copyOfSpecInfo);
    }

    public withTitle(value: string): OpenApi3SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.title = copyOfValue;
        return new OpenApi3SpecInfoBuilder(copyOfSpecInfo);
    }

    public withVersion(value: string): OpenApi3SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.version = copyOfValue;
        return new OpenApi3SpecInfoBuilder(copyOfSpecInfo);
    }

    public withXProperty(name: string, value: any) {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo[`x-${name}`] = copyOfValue;
        return new OpenApi3SpecInfoBuilder(copyOfSpecInfo);
    }
}

const defaultSpecInfo = {
    title: 'spec title',
    version: 'spec version'
};

export const openApi3SpecInfoBuilder = new OpenApi3SpecInfoBuilder(defaultSpecInfo);
