import * as _ from 'lodash';
import {GenericProperty, OpenApi3} from '../../../../lib/openapi-diff/types';

export class OpenApi3SpecBuilder {
    public constructor(private readonly openApi3Spec: OpenApi3) {}

    public build(): OpenApi3 {
        return _.cloneDeep(this.openApi3Spec);
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

export const openApi3SpecBuilder = new OpenApi3SpecBuilder(defaultOpenApi3Spec);
