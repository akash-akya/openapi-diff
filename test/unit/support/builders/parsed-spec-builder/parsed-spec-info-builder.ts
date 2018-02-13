import * as _ from 'lodash';

import {ParsedInfoObject} from '../../../../../lib/openapi-diff/types';
import {NamedGenericProperty} from './named-generic-property';

export class ParsedSpecInfoBuilder {
    public constructor(private readonly parsedInfo: ParsedInfoObject) {}

    public build(): ParsedInfoObject {
        return _.cloneDeep(this.parsedInfo);
    }

    public withContact(email: NamedGenericProperty,
                       name: NamedGenericProperty,
                       url: NamedGenericProperty): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfEmail = _.cloneDeep(email);
        const copyOfName = _.cloneDeep(name);
        const copyOfUrl = _.cloneDeep(url);
        _.set(
            copyOfParsedInfo.contact,
            copyOfEmail.name,
            {originalPath: copyOfEmail.originalPath, value: copyOfEmail.value}
        );
        _.set(
            copyOfParsedInfo.contact,
            copyOfName.name,
            {originalPath: copyOfName.originalPath, value: copyOfName.value}
        );
        _.set(
            copyOfParsedInfo.contact,
            copyOfUrl.name,
            {originalPath: copyOfUrl.originalPath, value: copyOfUrl.value}
        );
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }

    public withDescription(value: string): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedInfo.description.value = copyOfValue;
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }

    public withLicense(name: NamedGenericProperty,
                       url: NamedGenericProperty): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfName = _.cloneDeep(name);
        const copyOfUrl = _.cloneDeep(url);
        _.set(
            copyOfParsedInfo.license,
            copyOfName.name,
            {originalPath: copyOfName.originalPath, value: copyOfName.value}
        );
        _.set(
            copyOfParsedInfo.license,
            copyOfUrl.name,
            {originalPath: copyOfUrl.originalPath, value: copyOfUrl.value}
        );
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }

    public withNoDescription(): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        copyOfParsedInfo.description.value = undefined;
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }

    public withTermsOfService(value: string): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedInfo.termsOfService.value = copyOfValue;
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }

    public withTitle(value: string): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedInfo.title.value = copyOfValue;
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }

    public withVersion(value: string): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedInfo.version.value = copyOfValue;
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }

    public withXProperty(property: NamedGenericProperty): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfProperty = _.cloneDeep(property);
        _.set(
            copyOfParsedInfo.xProperties,
            copyOfProperty.name,
            {originalPath: copyOfProperty.originalPath, value: copyOfProperty.value}
        );
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }
}

const defaultParsedInfo: ParsedInfoObject = {
    contact: {
        email: {
            originalPath: ['info', 'contact', 'email'],
            value: undefined
        },
        name: {
            originalPath: ['info', 'contact', 'name'],
            value: undefined
        },
        url: {
            originalPath: ['info', 'contact', 'url'],
            value: undefined
        }
    },
    description: {
        originalPath: ['info', 'description'],
        value: undefined
    },
    license: {
        name: {
            originalPath: ['info', 'license', 'name'],
            value: undefined
        },
        url: {
            originalPath: ['info', 'license', 'url'],
            value: undefined
        }
    },
    termsOfService: {
        originalPath: ['info', 'termsOfService'],
        value: undefined
    },
    title: {
        originalPath: ['info', 'title'],
        value: 'spec title'
    },
    version: {
        originalPath: ['info', 'version'],
        value: 'spec version'
    },
    xProperties: {}
};

export const parsedSpecInfoBuilder = new ParsedSpecInfoBuilder(defaultParsedInfo);
