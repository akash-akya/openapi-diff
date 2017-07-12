import {
    OpenAPIDiff
} from './openapi-diff/types';

import * as q from 'q';

import jsonLoader from './openapi-diff/json-loader';
import resultReporter from './openapi-diff/result-reporter';
import specDiffer from './openapi-diff/spec-differ';
import specParser from './openapi-diff/spec-parser';

const openApiDiff: OpenAPIDiff = {
    run: (oldSpecPath, newSpecPath) => {
        const whenOldSpecPath = jsonLoader.load(oldSpecPath);
        const whenParsedOldSpec = whenOldSpecPath.then(specParser.parse);

        const whenNewSpecPath = jsonLoader.load(newSpecPath);
        const whenParsedNewSpec = whenNewSpecPath.then(specParser.parse);

        const whenDiff = q.all([whenParsedOldSpec, whenParsedNewSpec]).spread(specDiffer.diff);

        const whenResults = whenDiff.then(resultReporter.build);

        return whenResults;
    }
};

export default openApiDiff;
