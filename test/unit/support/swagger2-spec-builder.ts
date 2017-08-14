import * as _ from 'lodash';
import { GenericProperty } from '../../../lib/openapi-diff/types';

import { Spec as Swagger2 } from 'swagger-schema-official';

export interface Swagger2SpecBuilder {
    build(): Swagger2;
    withBasePath(value: string): Swagger2SpecBuilder;
    withCompleteInfoObject(): Swagger2SpecBuilder;
    withEmptySchemes(): Swagger2SpecBuilder;
    withHost(value: string): Swagger2SpecBuilder;
    withSchemes(value: string[]): Swagger2SpecBuilder;
    withTopLevelXProperty(property: GenericProperty): Swagger2SpecBuilder;
}

const createSwagger2SpecBuilder = (swagger2Spec: Swagger2): Swagger2SpecBuilder => {
    return {
        build: () => {
            return _.cloneDeep(swagger2Spec);
        },
        withBasePath: (value) => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            const copyOfValue = _.cloneDeep(value);
            copyOfSwagger2Spec.basePath = copyOfValue;
            return createSwagger2SpecBuilder(copyOfSwagger2Spec);
        },
        withCompleteInfoObject: () => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            copyOfSwagger2Spec.info = {
                contact: {
                    email: 'contact email',
                    name: 'contact name',
                    url: 'contact url'
                },
                description: 'spec description',
                license: {
                    name: 'license name',
                    url: 'license url'
                },
                termsOfService: 'terms of service',
                title: 'spec title',
                version: 'version'
            };
            return createSwagger2SpecBuilder(copyOfSwagger2Spec);
        },
        withEmptySchemes: () => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            copyOfSwagger2Spec.schemes = [];
            return createSwagger2SpecBuilder(copyOfSwagger2Spec);
        },
        withHost: (value) => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            const copyOfValue = _.cloneDeep(value);
            copyOfSwagger2Spec.host = copyOfValue;
            return createSwagger2SpecBuilder(copyOfSwagger2Spec);
        },
        withSchemes: (value) => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            const copyOfValue = _.cloneDeep(value);
            copyOfSwagger2Spec.schemes = copyOfValue;
            return createSwagger2SpecBuilder(copyOfSwagger2Spec);
        },
        withTopLevelXProperty: (property) => {
            const copyOfSwagger2Spec = _.cloneDeep(swagger2Spec);
            const copyOfProperty = _.cloneDeep(property);
            _.set(copyOfSwagger2Spec, copyOfProperty.key, copyOfProperty.value);
            return createSwagger2SpecBuilder(copyOfSwagger2Spec);
        }
    };
};

const defaultSwagger2Spec: Swagger2 = {
    info: {
        title: 'spec title',
        version: 'spec version'
    },
    paths: {},
    swagger: '2.0'
};

export default createSwagger2SpecBuilder(defaultSwagger2Spec);
