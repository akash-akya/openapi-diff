import * as _ from 'lodash';
import {GenericProperty, Swagger2} from '../../../../lib/openapi-diff/types';
import {
    swagger2SpecInfoBuilder,
    Swagger2SpecInfoBuilder
} from './swagger-2-spec-builder/swagger-2-spec-info-builder';

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
        copyOfSwagger2Spec.basePath = undefined;
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withNoHost(): Swagger2SpecBuilder {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        copyOfSwagger2Spec.host = undefined;
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withHost(value: string): Swagger2SpecBuilder {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        const copyOfValue = _.cloneDeep(value);
        copyOfSwagger2Spec.host = copyOfValue;
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withInfoObject(builder: Swagger2SpecInfoBuilder) {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        copyOfSwagger2Spec.info = builder.build();
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
        copyOfSwagger2Spec.schemes = undefined;
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }

    public withTopLevelXProperty(property: GenericProperty): Swagger2SpecBuilder {
        const copyOfSwagger2Spec = _.cloneDeep(this.swagger2Spec);
        const copyOfProperty = _.cloneDeep(property);
        _.set(copyOfSwagger2Spec, copyOfProperty.key, copyOfProperty.value);
        return new Swagger2SpecBuilder(copyOfSwagger2Spec);
    }
}

const defaultSwagger2Spec: Swagger2 = {
    info: {
        title: 'spec title',
        version: 'spec version'
    },
    paths: {},
    swagger: '2.0'
};

export {swagger2SpecInfoBuilder};

export const swagger2SpecBuilder = new Swagger2SpecBuilder(defaultSwagger2Spec);
