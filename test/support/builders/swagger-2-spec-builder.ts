import * as assert from 'assert';
import * as _ from 'lodash';
import {Swagger2, Swagger2Paths} from '../../../lib/openapi-diff/swagger2';

export class Swagger2SpecBuilder {
    public constructor(private readonly swagger2Spec: Swagger2) {}

    public build(): Swagger2 {
        return _.cloneDeep(this.swagger2Spec);
    }

    public withBasePath(value: string): Swagger2SpecBuilder {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        const copyOfValue = _.cloneDeep(value);
        copyOfSwagger2Spec.basePath = copyOfValue;
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withEmptySchemes(): Swagger2SpecBuilder {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        copyOfSwagger2Spec.schemes = [];
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withNoBasePath(): Swagger2SpecBuilder {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        delete copyOfSwagger2Spec.basePath;
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withSchemes(value: string[]): Swagger2SpecBuilder {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        const copyOfValue = _.cloneDeep(value);
        copyOfSwagger2Spec.schemes = copyOfValue;
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withNoSchemes(): Swagger2SpecBuilder {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        delete copyOfSwagger2Spec.schemes;
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withTopLevelXProperty(name: string, value: any): Swagger2SpecBuilder {
        assert.ok(name.indexOf('x-') === 0, `Expected name '${name}' to start with x-`);
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        const copyOfValue = _.cloneDeep(value);
        _.set(copyOfSwagger2Spec, name, copyOfValue);
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withPaths(paths: Swagger2Paths): Swagger2SpecBuilder {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        const copyOfPaths = _.cloneDeep(paths);
        copyOfSwagger2Spec.paths = copyOfPaths;
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }
}

const defaultSwagger2Spec: Swagger2 = {
    info: {
        title: 'default info.title',
        version: 'default info.version'
    },
    paths: {},
    swagger: '2.0'
};

export const swagger2SpecBuilder = new Swagger2SpecBuilder(defaultSwagger2Spec);
