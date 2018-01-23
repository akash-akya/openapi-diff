import * as _ from 'lodash';
// tslint:disable:no-implicit-dependencies
import {Info as InfoObject} from 'swagger-schema-official';

export class Swagger2SpecInfoBuilder {
    private specInfo: InfoObject;

    constructor(specInfo: InfoObject) {
        this.specInfo = specInfo;
    }

    public build(): InfoObject {
        return _.cloneDeep(this.specInfo);
    }

    public withContact(email?: string, name?: string, url?: string): Swagger2SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfEmail = _.cloneDeep(email);
        const copyOfName = _.cloneDeep(name);
        const copyOfUrl = _.cloneDeep(url);
        copyOfSpecInfo.contact = {
            email: copyOfEmail,
            name: copyOfName,
            url: copyOfUrl
        };
        return new Swagger2SpecInfoBuilder(copyOfSpecInfo);
    }
    public withDescription(value: string): Swagger2SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.description = copyOfValue;
        return new Swagger2SpecInfoBuilder(copyOfSpecInfo);
    }

    public withLicense(name: string, url?: string): Swagger2SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfName = _.cloneDeep(name);
        const copyOfUrl = _.cloneDeep(url);
        copyOfSpecInfo.license = {
            name: copyOfName,
            url: copyOfUrl
        };
        return new Swagger2SpecInfoBuilder(copyOfSpecInfo);
    }

    public withTermsOfService(value: string): Swagger2SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.termsOfService = copyOfValue;
        return new Swagger2SpecInfoBuilder(copyOfSpecInfo);
    }

    public withTitle(value: string): Swagger2SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.title = copyOfValue;
        return new Swagger2SpecInfoBuilder(copyOfSpecInfo);
    }

    public withVersion(value: string): Swagger2SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfSpecInfo.version = copyOfValue;
        return new Swagger2SpecInfoBuilder(copyOfSpecInfo);
    }

    public withXProperty(name: string, value: any): Swagger2SpecInfoBuilder {
        const copyOfSpecInfo = _.cloneDeep(this.specInfo);
        const copyOfValue = _.cloneDeep(value);
        (copyOfSpecInfo as any)[`x-${name}`] = copyOfValue;
        return new Swagger2SpecInfoBuilder(copyOfSpecInfo);
    }
}

const defaultSpecInfo = {
    title: 'spec title',
    version: 'spec version'
};

export const swagger2SpecInfoBuilder = new Swagger2SpecInfoBuilder(defaultSpecInfo);
