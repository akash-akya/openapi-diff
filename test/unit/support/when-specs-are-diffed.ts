import {DiffOutcome} from '../../../lib/api-types';
import {createOpenApiDiff} from './create-openapi-diff';

interface Builder {
    build(): any;
}

export const defaultSourceSpecPath = 'source-spec.json';
export const defaultDestinationSpecPath = 'destination-spec.json';

export const whenSpecsAreDiffed = async (
    sourceSpecBuilder: Builder, destinationSpecBuilder: Builder
): Promise<DiffOutcome> => {
    const openApiDiff = createOpenApiDiff();
    return openApiDiff.diffSpecs({
        destinationSpec: {
            content: JSON.stringify(destinationSpecBuilder.build()),
            location: defaultDestinationSpecPath
        },
        sourceSpec: {
            content: JSON.stringify(sourceSpecBuilder.build()),
            location: defaultSourceSpecPath
        }
    });
};
