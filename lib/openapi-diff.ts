import {
    Diff, OpenAPIDiff, OpenAPISpec, ParsedSpec, ResultObject
} from './openapi-diff/types';

import jsonLoader from './openapi-diff/json-loader';
import resultReporter from './openapi-diff/result-reporter';
import specDiffer from './openapi-diff/spec-differ';
import specParser from './openapi-diff/spec-parser';

const openApiDiff: OpenAPIDiff = {
    run: (oldSpecPath, newSpecPath) => {
        const oldSpec: OpenAPISpec = jsonLoader.load(oldSpecPath);
        const parsedOldSpec: ParsedSpec = specParser.parse(oldSpec as OpenAPISpec);

        const newSpec: OpenAPISpec = jsonLoader.load(newSpecPath);
        const parsedNewSpec: ParsedSpec = specParser.parse(newSpec as OpenAPISpec);

        const diffResult: Diff = specDiffer.diff(parsedOldSpec, parsedNewSpec);

        const results: ResultObject = resultReporter.print(diffResult);
        return results;
    }
};

export default openApiDiff;
