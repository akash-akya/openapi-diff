import * as _ from 'lodash';

import {
    ParsedProperty,
    ParsedSpec
} from '../../../lib/openapi-diff/types';
import { NamedGenericProperty } from './parsed-spec-builder/named-generic-property';

import { parsedSpecInfoBuilder, ParsedSpecInfoBuilder } from './parsed-spec-builder/parsed-spec-info-builder';

class ParsedSpecBuilder {
    private parsedSpec: ParsedSpec;

    constructor(parsedSpec: ParsedSpec) {
        this.parsedSpec = parsedSpec;
    }

    public build(): ParsedSpec {
        return _.cloneDeep(this.parsedSpec);
    }

    public withBasePath(value: string): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedSpec.basePath.value = copyOfValue;
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withInfoObject(builder: ParsedSpecInfoBuilder) {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        copyOfParsedSpec.info = builder.build();
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withEmptySchemes(): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        copyOfParsedSpec.schemes.value = [];
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withNoBasePath(): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        copyOfParsedSpec.basePath.value = undefined;
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withHost(value: string): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedSpec.host.value = copyOfValue;
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withNoHost(): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        copyOfParsedSpec.host.value = undefined;
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withNoSchemes(): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        copyOfParsedSpec.schemes.value = undefined;
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withNoTopLevelXProperties(): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        copyOfParsedSpec.xProperties = {};
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withOpenApi3(): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        copyOfParsedSpec.openapi = {
            originalPath: ['openapi'],
            value: '3.0.0'
        };
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withOpenApi(originalPath: string[], value: string): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        const copyOfOriginalPath = _.cloneDeep(originalPath);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedSpec.openapi = {
            originalPath: copyOfOriginalPath,
            value: copyOfValue
        };
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withSchemes(value: Array<ParsedProperty<string>>): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedSpec.schemes.value = copyOfValue;
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withSwagger2(): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        copyOfParsedSpec.openapi = {
            originalPath: ['swagger'],
            value: '2.0'
        };
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }

    public withTopLevelXProperty(property: NamedGenericProperty): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        const copyOfProperty = _.cloneDeep(property);
        _.set(
            copyOfParsedSpec.xProperties,
            copyOfProperty.name,
            {originalPath: copyOfProperty.originalPath, value: copyOfProperty.value}
        );
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }
}

const defaultParsedSpec: ParsedSpec = {
    basePath: {
        originalPath: ['basePath'],
        value: undefined
    },
    host: {
        originalPath: ['host'],
        value: undefined
    },
    info: parsedSpecInfoBuilder.build(),
    openapi: {
        originalPath: ['swagger'],
        value: '2.0'
    },
    schemes: {
        originalPath: ['schemes'],
        value: undefined
    },
    xProperties: {}
};

export { parsedSpecInfoBuilder };

export const parsedSpecBuilder = new ParsedSpecBuilder(defaultParsedSpec);
