import {OpenAPIObject as OpenApi3} from 'openapi3-ts';
// tslint:disable:no-implicit-dependencies
import {Spec as Swagger2} from 'swagger-schema-official';
import {OpenApiDiffOptions} from './api-types';
import {resultReporter} from './openapi-diff/result-reporter';
import {specDiffer} from './openapi-diff/spec-differ';
import {SpecLoader} from './openapi-diff/spec-loader';
import {specParser} from './openapi-diff/spec-parser';
import {OpenApiDiffInternal, ResultObject} from './openapi-diff/types';

export const validateSourceAndDestinationSpecContent = ({sourceSpec, destinationSpec}: OpenApiDiffOptions) => {
    const parsedSourceSpec = specParser.parse(sourceSpec.content);
    const parsedDestinationSpec = specParser.parse(destinationSpec.content);

    return specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);
};

export class OpenApiDiff implements OpenApiDiffInternal {
    public constructor(private readonly specLoader: SpecLoader) {}

    public async validate(sourceSpecPath: string, destinationSpecPath: string): Promise<ResultObject> {
        const [sourceSpec, destinationSpec] = await this.loadSpecs(sourceSpecPath, destinationSpecPath);
        const diffs = validateSourceAndDestinationSpecContent({
            destinationSpec: {
                content: destinationSpec,
                location: destinationSpecPath
            },
            sourceSpec: {
                content: sourceSpec,
                location: sourceSpecPath
            }
        });

        const results = resultReporter.build(diffs);
        return results;
    }

    private async loadSpecs(sourceSpecPath: string, destinationSpecPath: string): Promise<Array<Swagger2 | OpenApi3>> {
        const whenSourceSpec = this.specLoader.load(sourceSpecPath);
        const whenDestinationSpec = this.specLoader.load(destinationSpecPath);
        return Promise.all([whenSourceSpec, whenDestinationSpec]);
    }
}
