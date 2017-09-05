import * as _ from 'lodash';
import { GenericProperty } from '../../../../lib/openapi-diff/types';

import { OpenAPIObject as OpenApi3 } from 'openapi3-ts';
import {
    openApi3SpecInfoBuilder,
    OpenApi3SpecInfoBuilder
} from './openapi-3-spec-builder/openapi-3-spec-info-builder';

class OpenApi3SpecBuilder {
    private openApi3Spec: OpenApi3;

    constructor(openApi3Spec: OpenApi3) {
        this.openApi3Spec = openApi3Spec;
    }

    public build(): OpenApi3 {
        return _.cloneDeep(this.openApi3Spec);
    }

    public withInfoObject(builder: OpenApi3SpecInfoBuilder) {
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

export { openApi3SpecInfoBuilder };

export const openApi3SpecBuilder = new OpenApi3SpecBuilder(defaultOpenApi3Spec);
