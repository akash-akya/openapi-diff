import {DiffOutcome, SpecFormat} from './api-types';
import {ContentLoader} from './openapi-diff/content-loader';
import {ResultReporter} from './openapi-diff/result-reporter';
import {SpecDiffer} from './openapi-diff/spec-differ';

export type SpecFormatOrAuto = SpecFormat | 'auto-detect';

export interface SpecReference {
    location: string;
    format: SpecFormatOrAuto;
}

export interface DiffPathsOptions {
    sourceSpec: SpecReference;
    destinationSpec: SpecReference;
}

export interface SerialisedSpec {
    content: string;
    location: string;
    format: string;
}

export interface DiffSpecsOptions {
    sourceSpec: SerialisedSpec;
    destinationSpec: SerialisedSpec;
}

export interface DeserialisedSpec {
    content: any;
    location: string;
    unverifiedFormat: string;
}

export class OpenApiDiff {
    public constructor(
        private readonly contentLoader: ContentLoader,
        private readonly resultReporter: ResultReporter
    ) {}

    public async diffPaths(diffPathOptions: DiffPathsOptions): Promise<void> {
        try {
            const diffSpecOptions = await this.toDiffSpecsOptions(diffPathOptions);
            const diffOutcome = await this.diffSpecs(diffSpecOptions);

            this.resultReporter.reportOutcome(diffOutcome);

            if (diffOutcome.breakingDifferencesFound) {
                return Promise.reject(new Error('Breaking differences found'));
            }
        } catch (error) {
            this.resultReporter.reportError(error);
            throw error;
        }
    }

    public async diffSpecs(options: DiffSpecsOptions): Promise<DiffOutcome> {
        return SpecDiffer.diffSpecs(options);
    }

    private async toDiffSpecsOptions({sourceSpec, destinationSpec}: DiffPathsOptions): Promise<DiffSpecsOptions> {
        const [sourceSerialisedSpec, destinationSerialisedSpec] = await Promise.all([
            this.toSerialisedSpec(sourceSpec),
            this.toSerialisedSpec(destinationSpec)
        ]);
        return {sourceSpec: sourceSerialisedSpec, destinationSpec: destinationSerialisedSpec};
    }

    private async toSerialisedSpec(specReference: SpecReference): Promise<SerialisedSpec> {
        const serializedContent = await this.contentLoader.load(specReference.location);
        return {
            content: serializedContent,
            format: specReference.format,
            location: specReference.location
        };
    }
}
