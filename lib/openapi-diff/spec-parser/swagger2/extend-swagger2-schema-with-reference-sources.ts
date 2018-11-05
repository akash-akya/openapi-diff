import * as _ from 'lodash';
import {ExtendedSwagger2Schema, Swagger2, Swagger2Schema} from '../../swagger2';

export const extendSwagger2SchemaWithReferenceSources = (
    schema: Swagger2Schema, spec: Swagger2
): ExtendedSwagger2Schema => {
    return {...schema, definitions: _.cloneDeep(spec.definitions) || {}};
};
