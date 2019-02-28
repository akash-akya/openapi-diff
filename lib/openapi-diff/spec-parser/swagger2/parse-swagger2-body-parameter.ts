import {ParsedJsonSchema, ParsedRequestBody} from '../../spec-parser-types';
import {
    Swagger2,
    Swagger2BodyParameter,
    Swagger2Parameter,
    Swagger2Parameters
} from '../../swagger2';
import {dereferenceObject} from '../common/dereference-object';
import {PathBuilder} from '../common/path-builder';
import {parseSwagger2BodyObjectJsonSchema} from './parse-swagger2-body-object-json-schema';

const parseBodyParameterJsonSchema = (
    bodyParameter: Swagger2BodyParameter | undefined, pathBuilder: PathBuilder, spec: Swagger2
): ParsedJsonSchema | undefined => {
    return bodyParameter
        ? parseSwagger2BodyObjectJsonSchema(bodyParameter, pathBuilder, spec)
        : undefined;
};

const resolveParameters = (parameterOrReferenceArray: Swagger2Parameters, spec: Swagger2): Swagger2Parameter[] =>
    parameterOrReferenceArray.map((entry) => dereferenceObject(entry, spec));

interface BodyParameterAndIndex {
    bodyParameter?: Swagger2BodyParameter;
    index: number;
}

const findBodyParameterAndIndex = (parameters: Swagger2Parameters, spec: Swagger2): BodyParameterAndIndex => {
    const resolvedParameters: Swagger2Parameter[] = resolveParameters(parameters, spec);
    const index = resolvedParameters.findIndex((resolvedParameter) => resolvedParameter.in === 'body');

    return {bodyParameter: resolvedParameters[index] as Swagger2BodyParameter, index};
};

export const parseSwagger2BodyParameter = (
    parameters: Swagger2Parameters, pathBuilder: PathBuilder, spec: Swagger2
): ParsedRequestBody => {
    const {bodyParameter, index} = findBodyParameterAndIndex(parameters, spec);
    const jsonSchema = parseBodyParameterJsonSchema(bodyParameter, pathBuilder.withChild(`${index}`), spec);

    return {
        jsonSchema,
        originalValue: {
            originalPath: pathBuilder.build(),
            value: bodyParameter
        }
    };
};
