import {SpecFormat} from '../../api-types';
import {OpenApiDiffErrorImpl} from '../../common/open-api-diff-error-impl';
import {DeserialisedSpec, SpecFormatOrAuto} from '../../openapi-diff';
import {isSwagger2Content} from './swagger2/is-swagger2-content';

const detectContentFormat = (specContent: any): SpecFormat =>
    isSwagger2Content(specContent) ? 'swagger2' : 'openapi3';

const typeSafeSupportedFormats: {[format in SpecFormat]: null} = {
    openapi3: null,
    swagger2: null
};

const supportedFormats = Object.keys(typeSafeSupportedFormats);

const isSpecFormat = (unverifiedFormat: string): unverifiedFormat is SpecFormat =>
    supportedFormats.indexOf(unverifiedFormat) >= 0;

const toVerifiedFormat = (spec: DeserialisedSpec): SpecFormat => {
    if (!isSpecFormat(spec.unverifiedFormat)) {
        throw new OpenApiDiffErrorImpl(
            'OPENAPI_DIFF_PARSE_ERROR',
            `"${spec.location}" format "${spec.unverifiedFormat}" is not supported`
        );
    }
    return spec.unverifiedFormat;
};

const autoDetectFormat: SpecFormatOrAuto = 'auto-detect';

const isAutoDetect = (unverifiedFormat: string): boolean =>
    unverifiedFormat === autoDetectFormat;

export const resolveSpecFormat = (spec: DeserialisedSpec): SpecFormat =>
    isAutoDetect(spec.unverifiedFormat)
        ? detectContentFormat(spec.content)
        : toVerifiedFormat(spec);
