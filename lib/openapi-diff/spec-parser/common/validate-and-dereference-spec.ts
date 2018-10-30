import * as SwaggerParser from 'swagger-parser';
import {OpenApiDiffErrorImpl} from '../../../common/open-api-diff-error-impl';
import {OpenApi3} from '../../openapi3';
import {Swagger2} from '../../swagger2';

export const validateAndDereferenceSpec = async <T extends Swagger2 | OpenApi3>(
    spec: object, location: string
): Promise<T> => {
    try {
        const options: any = {
            dereference: {circular: false}
        };
        return await SwaggerParser.validate(spec as any, options);
    } catch (error) {
        throw new OpenApiDiffErrorImpl(
            'OPENAPI_DIFF_PARSE_ERROR',
            `Validation errors in "${location}"`,
            error
        );
    }
};
