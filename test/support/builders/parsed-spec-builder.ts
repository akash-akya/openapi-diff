import * as _ from 'lodash';

import {
    ParsedProperty,
    ParsedSpec
} from '../../../lib/openapi-diff/spec-parser-types';
import {ParsedPathItemBuilder} from './parsed-path-item-builder';
import {NamedGenericProperty} from './parsed-spec-builder/named-generic-property';

class ParsedSpecBuilder {
    public constructor(private readonly parsedSpec: ParsedSpec) {}

    public build(): ParsedSpec {
        return _.cloneDeep(this.parsedSpec);
    }

    public withBasePath(value: string): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedSpec.basePath.value = copyOfValue;
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

    public withSchemes(value: Array<ParsedProperty<string>>): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedSpec.schemes.value = copyOfValue;
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

    public withPaths(paths: ParsedPathItemBuilder[]): ParsedSpecBuilder {
        const copyOfParsedSpec = _.cloneDeep(this.parsedSpec);
        copyOfParsedSpec.paths = paths.map((pathBuilder) => pathBuilder.build());
        return new ParsedSpecBuilder(copyOfParsedSpec);
    }
}

const defaultParsedSpec: ParsedSpec = {
    basePath: {
        originalPath: ['basePath'],
        value: undefined
    },
    format: 'swagger2',
    paths: [],
    schemes: {
        originalPath: ['schemes'],
        value: undefined
    },
    xProperties: {}
};

export const parsedSpecBuilder = new ParsedSpecBuilder(defaultParsedSpec);
