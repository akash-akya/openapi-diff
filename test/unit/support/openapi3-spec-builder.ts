import * as _ from 'lodash';
import {GenericProperty} from '../../../lib/openapi-diff/types';

import { OpenAPIObject as OpenApi3 } from 'openapi3-ts';

export interface OpenApi3SpecBuilder {
    build(): OpenApi3;
    withSchemes(value: string[]): OpenApi3SpecBuilder;
    withTopLevelXProperties(properties: GenericProperty[] ): OpenApi3SpecBuilder;
}

const openApi3Spec: OpenApi3 = {
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

const openApi3SpecBuilder = (newOpenApi3Spec?: OpenApi3): OpenApi3SpecBuilder => {
    return {
        build: () => {
            return newOpenApi3Spec || openApi3Spec;
        },
        withSchemes: (value) => {
            const copyOfOpenApi3Spec = _.cloneDeep(openApi3Spec);
            copyOfOpenApi3Spec.schemes = value;
            return openApi3SpecBuilder(copyOfOpenApi3Spec);
        },
        withTopLevelXProperties: (properties) => {
            const copyOfOpenApi3Spec = _.cloneDeep(openApi3Spec);
            for (const property of properties) {
                _.set(copyOfOpenApi3Spec, property .key, property.value);
            }
            return openApi3SpecBuilder(copyOfOpenApi3Spec);
        }
    };
};

export default openApi3SpecBuilder();
