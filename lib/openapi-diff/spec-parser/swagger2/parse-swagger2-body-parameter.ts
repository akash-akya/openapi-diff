import {ParsedRequestBody} from '../../spec-parser-types';
import {Swagger2BodyParameter, Swagger2Parameter} from '../../swagger2';
import {PathBuilder} from '../common/path-builder';

const toParsedRequestBody = (bodyParameter: Swagger2BodyParameter, pathBuilder: PathBuilder) => {
    return {
        jsonSchema: {
            originalPath: pathBuilder.withChild('schema').build(),
            value: bodyParameter.schema
        },
        originalValue: {
            originalPath: pathBuilder.build(),
            value: bodyParameter
        }
    };
};

interface BodyParameterAndIndex {
    bodyParameter?: Swagger2BodyParameter;
    index: number;
}

const findBodyParameterAndIndex = (parameters: Swagger2Parameter[]): BodyParameterAndIndex => {
    const index = parameters.findIndex((parameter) => parameter.in === 'body');

    return {bodyParameter: parameters[index], index};
};

export const parseSwagger2BodyParameter = (
    parameters: Swagger2Parameter[], pathBuilder: PathBuilder
): ParsedRequestBody => {
    const {bodyParameter, index} = findBodyParameterAndIndex(parameters);

    return bodyParameter
        ? toParsedRequestBody(bodyParameter, pathBuilder.withChild(`${index}`))
        : {
            originalValue: {
                originalPath: pathBuilder.build(),
                value: undefined
            }
        };
};
