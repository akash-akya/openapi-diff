import {ParsedProperty} from '../../spec-parser-types';
import {Swagger2, Swagger2BodyParameter, Swagger2Response, Swagger2Schema} from '../../swagger2';
import {PathBuilder} from '../common/path-builder';
import {extendSwagger2SchemaWithReferenceSources} from './extend-swagger2-schema-with-reference-sources';

const toParsedProperty = (schema: Swagger2Schema, pathBuilder: PathBuilder, spec: Swagger2): ParsedProperty => {
    return {
        originalPath: pathBuilder.withChild('schema').build(),
        value: extendSwagger2SchemaWithReferenceSources(schema, spec)
    };
};

export const parseSwagger2BodyObjectJsonSchema = (
    bodyObject: Swagger2BodyParameter | Swagger2Response, pathBuilder: PathBuilder, spec: Swagger2
): ParsedProperty | undefined => {
    return bodyObject.schema
        ? toParsedProperty(bodyObject.schema, pathBuilder, spec)
        : undefined;
};
