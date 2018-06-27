import * as assert from 'assert';
import * as _ from 'lodash';
import {OpenApi3, OpenApi3Paths} from '../../../lib/openapi-diff/openapi3';

export class OpenApi3SpecBuilder {
    public constructor(private readonly openApi3Spec: OpenApi3) {}

    public build(): OpenApi3 {
        return _.cloneDeep(this.openApi3Spec);
    }

    public withTopLevelXProperty(name: string, value: any): OpenApi3SpecBuilder {
        assert.ok(name.indexOf('x-') === 0, `Expected name '${name}' to start with x-`);
        const copyOfOpenApi3Spec = _.cloneDeep(this.openApi3Spec);
        const copyOfValue = _.cloneDeep(value);
        _.set(copyOfOpenApi3Spec, name, copyOfValue);
        return new OpenApi3SpecBuilder(copyOfOpenApi3Spec);
    }

    public withPaths(paths: OpenApi3Paths): OpenApi3SpecBuilder {
        const copyOfOpenApi3Spec = _.cloneDeep(this.openApi3Spec);
        const copyOfPaths = _.cloneDeep(paths);
        copyOfOpenApi3Spec.paths = copyOfPaths;
        return new OpenApi3SpecBuilder(copyOfOpenApi3Spec);
    }
}

const defaultOpenApi3Spec: OpenApi3 = {
    components: {
        callbacks: {},
        examples: {},
        headers: {},
        links: {},
        parameters: {},
        paths: {},
        requestBodies: {},
        responses: {},
        schemas: {},
        securitySchemes: {}
    },
    info: {
        title: 'spec title',
        version: 'spec version'
    },
    openapi: '3.0.0',
    paths: {}
};

export const openApi3SpecBuilder = new OpenApi3SpecBuilder(defaultOpenApi3Spec);
