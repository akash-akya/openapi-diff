import * as _ from 'lodash';
import {GenericProperty} from '../../../lib/openapi-diff/types';

import {OpenAPIObject as OpenApi3} from 'openapi3-ts';
import {
    genericSpecInfoBuilder,
    GenericSpecInfoBuilder
} from './openapi-generic-spec-builder/openapi-generic-info-builder';

class OpenApi3SpecBuilder {
    private openApi3Spec: OpenApi3;

    constructor(openApi3Spec: OpenApi3) {
        this.openApi3Spec = openApi3Spec;
    }

    public build(): OpenApi3 {
        return _.cloneDeep(this.openApi3Spec);
    }

    public withInfoObject(builder: GenericSpecInfoBuilder) {
        const copyOfOpenApi3Spec = _.cloneDeep(this.openApi3Spec);
        copyOfOpenApi3Spec.info = builder.build();
        return new OpenApi3SpecBuilder(copyOfOpenApi3Spec);
    }

    public withTopLevelXProperty(property: GenericProperty): OpenApi3SpecBuilder {
        const copyOfOpenApi3Spec = _.cloneDeep(this.openApi3Spec);
        const copyOfProperty = _.cloneDeep(property);
        _.set(copyOfOpenApi3Spec, copyOfProperty.key, copyOfProperty.value);
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

export { genericSpecInfoBuilder };

export const openApi3SpecBuilder = new OpenApi3SpecBuilder(defaultOpenApi3Spec);
