import {OpenApiDiffErrorImpl} from '../../common/open-api-diff-error-impl';
import {OpenApi3} from '../openapi3';
import {validateAndDereferenceSpec} from './common/validate-and-dereference-spec';
import {isOpenApi3Content} from './openapi3/is-openapi3-content';

const validateSpecFormat = (content: any, location: string): void => {
    if (!isOpenApi3Content(content)) {
        throw new OpenApiDiffErrorImpl('OPENAPI_DIFF_PARSE_ERROR', `"${location}" is not a "openapi3" spec`);
    }
};

export const validateAndDereferenceOpenapi3Spec = async (content: any, location: string): Promise<OpenApi3> => {
    validateSpecFormat(content, location);
    return validateAndDereferenceSpec<OpenApi3>(content, location);
};
