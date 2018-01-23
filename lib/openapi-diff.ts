import {OpenAPIDiff} from './openapi-diff/types';

import fileSystem from './openapi-diff/resource-loader/file-system';
import httpClient from './openapi-diff/resource-loader/http-client';
import resultReporter from './openapi-diff/result-reporter';
import specDiffer from './openapi-diff/spec-differ';
import jsonLoader from './openapi-diff/spec-loader';
import specParser from './openapi-diff/spec-parser';

export const openApiDiff: OpenAPIDiff = {
    run: async (oldSpecPath, newSpecPath) => {

        const whenOldSpec = jsonLoader.load(oldSpecPath, fileSystem, httpClient);
        const whenNewSpec = jsonLoader.load(newSpecPath, fileSystem, httpClient);
        const rawSpecs = await Promise.all([whenOldSpec, whenNewSpec]);

        const oldSpec = rawSpecs[0];
        const oldParsedSpec = specParser.parse(oldSpec);

        const newSpec = rawSpecs[1];
        const newParsedSpec = specParser.parse(newSpec);

        const diff = specDiffer.diff(oldParsedSpec, newParsedSpec);

        const results = resultReporter.build(diff);
        return results;
    }
};
