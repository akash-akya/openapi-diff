import * as _ from 'lodash';
import {ExtendedOpenApi3Schema, OpenApi3, OpenApi3Schema} from '../../openapi3';

export const extendOpenApi3SchemaWithReferenceSources = (
    schema: OpenApi3Schema, spec: OpenApi3
): ExtendedOpenApi3Schema => {
    const schemas = spec.components ? _.cloneDeep(spec.components.schemas) : {};

    return { ...schema, components: {schemas} };
};
