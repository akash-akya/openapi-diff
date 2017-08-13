import * as _ from 'lodash';

import {
    ParsedSpec,
    ParsedTopLevelArrayMember
} from '../../../lib/openapi-diff/types';

interface NamedGenericProperty {
    name: string;
    originalPath: string[];
    value?: any;
}

export interface ParsedSpecBuilder {
    build(): ParsedSpec;
    withBasePath(value: string): ParsedSpecBuilder;
    withNoBasePath(): ParsedSpecBuilder;
    withHost(value: string): ParsedSpecBuilder;
    withNoHost(): ParsedSpecBuilder;
    withNoSchemes(): ParsedSpecBuilder;
    withOpenApi(originalPath: string[], value: string): ParsedSpecBuilder;
    withSchemes(value: ParsedTopLevelArrayMember[]): ParsedSpecBuilder;
    withTopLevelXProperty(property: NamedGenericProperty): ParsedSpecBuilder;
    withEmptySchemes(): ParsedSpecBuilder;
}

const createParsedSpecBuilder = (parsedSpec: ParsedSpec): ParsedSpecBuilder => {
    return {
        build: () => {
            return _.cloneDeep(parsedSpec);
        },
        withBasePath: (value) => {
            const copyOfParsedSpec = _.cloneDeep(parsedSpec);
            const copyOfValue = _.cloneDeep(value);
            copyOfParsedSpec.basePath.value = copyOfValue;
            return createParsedSpecBuilder(copyOfParsedSpec);
        },
        withEmptySchemes: () => {
            const copyOfParsedSpec = _.cloneDeep(parsedSpec);
            copyOfParsedSpec.schemes.value = [];
            return createParsedSpecBuilder(copyOfParsedSpec);
        },
        withHost: (value) => {
            const copyOfParsedSpec = _.cloneDeep(parsedSpec);
            const copyOfValue = _.cloneDeep(value);
            copyOfParsedSpec.host.value = copyOfValue;
            return createParsedSpecBuilder(copyOfParsedSpec);
        },
        withNoBasePath: () => {
            const copyOfParsedSpec = _.cloneDeep(parsedSpec);
            copyOfParsedSpec.basePath.value = undefined;
            return createParsedSpecBuilder(copyOfParsedSpec);
        },
        withNoHost: () => {
            const copyOfParsedSpec = _.cloneDeep(parsedSpec);
            copyOfParsedSpec.host.value = undefined;
            return createParsedSpecBuilder(copyOfParsedSpec);
        },
        withNoSchemes: () => {
            const copyOfParsedSpec = _.cloneDeep(parsedSpec);
            copyOfParsedSpec.schemes.value = undefined;
            return createParsedSpecBuilder(copyOfParsedSpec);
        },
        withOpenApi: (originalPath, value) => {
            const copyOfParsedSpec = _.cloneDeep(parsedSpec);
            const copyOfOriginalPath = _.cloneDeep(originalPath);
            const copyOfValue = _.cloneDeep(value);
            copyOfParsedSpec.openapi = {
                originalPath: copyOfOriginalPath,
                value: copyOfValue
            };
            return createParsedSpecBuilder(copyOfParsedSpec);
        },
        withSchemes: (value) => {
            const copyOfParsedSpec = _.cloneDeep(parsedSpec);
            const copyOfValue = _.cloneDeep(value);
            copyOfParsedSpec.schemes.value = copyOfValue;
            return createParsedSpecBuilder(copyOfParsedSpec);
        },
        withTopLevelXProperty: (property) => {
            const copyOfParsedSpec = _.cloneDeep(parsedSpec);
            const copyOfProperty = _.cloneDeep(property);
            _.set(
                copyOfParsedSpec,
                copyOfProperty.name,
                {originalPath: copyOfProperty.originalPath, value: copyOfProperty.value}
            );
            return createParsedSpecBuilder(copyOfParsedSpec);
        }
    };
};

const defaultSpec = {
    basePath: {
        originalPath: ['basePath'],
        value: undefined
    },
    host: {
        originalPath: ['host'],
        value: undefined
    },
    info: {
        title: 'spec title',
        version: 'spec version'
    },
    openapi: {
        originalPath: ['swagger'],
        value: '2.0'
    },
    schemes: {
        originalPath: ['schemes'],
        value: undefined
    }
};

export default createParsedSpecBuilder(defaultSpec);
