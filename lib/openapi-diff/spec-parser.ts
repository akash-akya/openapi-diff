import {ParsedSpec} from './spec-parser-types';
import {parseOpenApi3Spec} from './spec-parser/openapi3-parser';
import {validateAndParseSwagger2Spec} from './spec-parser/swagger2-parser';

const isSwagger2 = (spec: object): boolean => {
    return spec.hasOwnProperty('swagger');
};

export const specParser = {
    parse: async (spec: object, location: string): Promise<ParsedSpec> => {
        return isSwagger2(spec)
            ? validateAndParseSwagger2Spec(spec, location)
            : parseOpenApi3Spec(spec);
    }
};
