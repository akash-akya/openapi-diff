import { OpenAPIDiff } from './openapi-diff/types';

import * as q from 'q';

import jsonLoader from './openapi-diff/json-loader';
import fileSystem from './openapi-diff/json-loader/file-system';
import httpClient from './openapi-diff/json-loader/http-client';
import resultReporter from './openapi-diff/result-reporter';
import specDiffer from './openapi-diff/spec-differ';
import specParser from './openapi-diff/spec-parser';

const openApiDiff: OpenAPIDiff = {
    run: (oldSpecPath, newSpecPath) => {
        const whenOldSpec = jsonLoader.load(oldSpecPath, fileSystem, httpClient);
        const whenParsedOldSpec = whenOldSpec.then(specParser.parse);

        const whenNewSpec = jsonLoader.load(newSpecPath, fileSystem, httpClient);
        const whenParsedNewSpec = whenNewSpec.then(specParser.parse);

        const whenDiff = q.all([whenParsedOldSpec, whenParsedNewSpec]).spread(specDiffer.diff);

        const whenResults = whenDiff.then(resultReporter.build);

        return whenResults;
    }
};

export default openApiDiff;
