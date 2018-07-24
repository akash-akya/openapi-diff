import {OpenApiDiffErrorImpl} from '../../../common/open-api-diff-error-impl';
import {Swagger2} from '../../swagger2';
import {validateAndDereferenceSpec} from '../common/validate-and-dereference-spec';
import {isSwagger2Content} from './is-swagger2-content';

const validateSpecFormat = (content: any, location: string): void => {
    if (!isSwagger2Content(content)) {
        throw new OpenApiDiffErrorImpl('OPENAPI_DIFF_PARSE_ERROR', `"${location}" is not a "swagger2" spec`);
    }
};

export const validateAndDereferenceSwagger2Spec = async (content: any, location: string): Promise<Swagger2> => {
    validateSpecFormat(content, location);
    return validateAndDereferenceSpec<Swagger2>(content, location);
};
