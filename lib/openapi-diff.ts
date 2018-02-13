import {resultReporter} from './openapi-diff/result-reporter';
import {specDiffer} from './openapi-diff/spec-differ';
import {SpecLoader} from './openapi-diff/spec-loader';
import {specParser} from './openapi-diff/spec-parser';
import {OpenApiDiff, ResultObject} from './openapi-diff/types';

export class OpenApiDiffImpl implements OpenApiDiff {
    public constructor(private readonly specLoader: SpecLoader) {}

    public async run(oldSpecPath: string, newSpecPath: string): Promise<ResultObject> {
        const whenOldSpec = this.specLoader.load(oldSpecPath);
        const whenNewSpec = this.specLoader.load(newSpecPath);
        const rawSpecs = await Promise.all([whenOldSpec, whenNewSpec]);

        const oldSpec = rawSpecs[0];
        const oldParsedSpec = specParser.parse(oldSpec);

        const newSpec = rawSpecs[1];
        const newParsedSpec = specParser.parse(newSpec);

        const diff = specDiffer.diff(oldParsedSpec, newParsedSpec);

        const results = resultReporter.build(diff);
        return results;
    }
}
