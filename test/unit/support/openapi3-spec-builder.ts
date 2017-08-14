import * as _ from 'lodash';
import {GenericProperty} from '../../../lib/openapi-diff/types';

import {OpenAPIObject as OpenApi3} from 'openapi3-ts';

export interface OpenApi3SpecBuilder {
    build(): OpenApi3;
    withBasicInfoObject(): OpenApi3SpecBuilder;
    withTopLevelXProperty(property: GenericProperty): OpenApi3SpecBuilder;
}

const createOpenApi3SpecBuilder = (openApi3Spec: OpenApi3): OpenApi3SpecBuilder => {
    return {
        build: () => {
            return _.cloneDeep(openApi3Spec);
        },
        withBasicInfoObject: () => {
            const copyOfOpenApi3Spec = _.cloneDeep(openApi3Spec);
            copyOfOpenApi3Spec.info = {
                title: 'spec title',
                version: 'spec version'
            };
            return createOpenApi3SpecBuilder(copyOfOpenApi3Spec);
        },
        withTopLevelXProperty: (property) => {
            const copyOfOpenApi3Spec = _.cloneDeep(openApi3Spec);
            const copyOfProperty = _.cloneDeep(property);
            _.set(copyOfOpenApi3Spec, copyOfProperty.key, copyOfProperty.value);
            return createOpenApi3SpecBuilder(copyOfOpenApi3Spec);
        }
    };
};

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

export default createOpenApi3SpecBuilder(defaultOpenApi3Spec);
