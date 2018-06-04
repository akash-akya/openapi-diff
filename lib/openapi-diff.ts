import {DiffOutcome, OpenApiDiffOptions} from './api-types';
import {ContentLoader} from './openapi-diff/content-loader';
import {ResultReporter} from './openapi-diff/result-reporter';
import {SpecDiffer} from './openapi-diff/spec-differ';

export class OpenApiDiff {
    public constructor(
        private readonly contentLoader: ContentLoader,
        private readonly resultReporter: ResultReporter
    ) {}

    public async diffPaths(sourceSpecPath: string, destinationSpecPath: string): Promise<void> {
        try {
            const loadedSpecs = await this.loadSpecs(sourceSpecPath, destinationSpecPath);

            const diffOutcome = await this.diffSpecs(loadedSpecs);

            this.resultReporter.reportOutcome(diffOutcome);

            if (diffOutcome.breakingDifferencesFound) {
                return Promise.reject(new Error('Breaking differences found'));
            }
        } catch (error) {
            this.resultReporter.reportError(error);
            throw error;
        }
    }

    public diffSpecs(options: OpenApiDiffOptions): Promise<DiffOutcome> {
        return SpecDiffer.diffSpecs(options);
    }

    private async loadSpecs(sourceSpecPath: string, destinationSpecPath: string): Promise<OpenApiDiffOptions> {
        const whenSourceSpec = this.contentLoader.load(sourceSpecPath);
        const whenDestinationSpec = this.contentLoader.load(destinationSpecPath);
        const [sourceSpec, destinationSpec] = await Promise.all([whenSourceSpec, whenDestinationSpec]);
        return {
            destinationSpec: {location: destinationSpecPath, content: destinationSpec},
            sourceSpec: {location: sourceSpecPath, content: sourceSpec}
        };
    }
}
