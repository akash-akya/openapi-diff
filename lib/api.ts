import * as OpenApiDiff from './api-types';
import {validateSourceAndDestinationSpecContent} from './openapi-diff';

const openApiDiff: typeof OpenApiDiff = {
    validate: async (options) =>
        validateSourceAndDestinationSpecContent(options)
};

export = openApiDiff;
