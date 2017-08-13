import * as _ from 'lodash';
import {GenericProperty} from '../../../lib/openapi-diff/types';

import {Spec as Swagger2} from 'swagger-schema-official';

export interface Swagger2SpecBuilder {
    build(): Swagger2;
    withBasePath(value: string): Swagger2SpecBuilder;
    withHost(value: string): Swagger2SpecBuilder;
    withSchemes(value: string[]): Swagger2SpecBuilder;
    withTopLevelXProperties(properties: GenericProperty[] ): Swagger2SpecBuilder;
}

const swagger2Spec: Swagger2 = {
    info: {
        title: 'spec title',
        version: 'spec version'
    },
    paths: {},
    swagger: '2.0'
};

const swagger2SpecBuilder = (newSwagger2Spec?: Swagger2): Swagger2SpecBuilder => {
    return {
        build: () => {
            return newSwagger2Spec || swagger2Spec;
        },
        withBasePath: (value) => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            copyOfSwagger2Spec.basePath = value;
            return swagger2SpecBuilder(copyOfSwagger2Spec);
        },
        withHost: (value) => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            copyOfSwagger2Spec.host = value;
            return swagger2SpecBuilder(copyOfSwagger2Spec);
        },
        withSchemes: (value) => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            copyOfSwagger2Spec.schemes = value;
            return swagger2SpecBuilder(copyOfSwagger2Spec);
        },
        withTopLevelXProperties: (properties) => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            for (const property of properties) {
                _.set(copyOfSwagger2Spec, property .key, property.value);
            }
            return swagger2SpecBuilder(copyOfSwagger2Spec);
        }
    };
};

export default swagger2SpecBuilder();
