import {DeserialisedSpec} from '../openapi-diff';
import {ParsedSpec} from './spec-parser-types';
import {parseOpenApi3Spec} from './spec-parser/openapi3/parse-openapi3-spec';
import {validateAndDereferenceOpenapi3Spec} from './spec-parser/openapi3/validate-and-dereference-openapi3-spec';
import {resolveSpecFormat} from './spec-parser/resolve-spec-format';
import {parseSwagger2Spec} from './spec-parser/swagger2/parse-swagger2-spec';
import {validateAndDereferenceSwagger2Spec} from './spec-parser/swagger2/validate-and-dereference-swagger2-spec';

export class SpecParser {
    public static parse(spec: DeserialisedSpec): Promise<ParsedSpec> {
        const specFormat = resolveSpecFormat(spec);

        return specFormat === 'swagger2'
            ? this.validateAndParseSwagger2(spec.content, spec.location)
            : this.validateAndParseOpenApi3(spec.content, spec.location);
    }

    private static async validateAndParseSwagger2(content: any, location: string): Promise<ParsedSpec> {
        const spec = await validateAndDereferenceSwagger2Spec(content, location);
        return parseSwagger2Spec(spec);
    }

    private static async validateAndParseOpenApi3(content: any, location: string): Promise<ParsedSpec> {
        const spec = await validateAndDereferenceOpenapi3Spec(content, location);
        return parseOpenApi3Spec(spec);
    }
}
