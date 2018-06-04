import * as OpenApiDiff from './api-types';
import {CliFactory} from './cli-factory';

const openApiDiff: typeof OpenApiDiff = {
    diffSpecs: async (options) => CliFactory.createOpenApiDiff().diffSpecs(options)
};

export = openApiDiff;
