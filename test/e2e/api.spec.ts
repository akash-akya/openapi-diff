import * as assert from 'assert';
import * as OpenApiDiff from '../../lib/api';
import {DiffOutcome, DiffOutcomeFailure, SpecOption} from '../../lib/api-types';
import {OpenApiDiffErrorImpl} from '../../lib/common/open-api-diff-error-impl';
import {openApi3SpecBuilder} from '../support/builders/openapi3-spec-builder';
import {openapi3SpecsDifferenceBuilder} from '../support/builders/openapi3-specs-difference-builder';
import {specOptionBuilder} from '../support/builders/spec-option-builder';
import {swagger2SpecBuilder} from '../support/builders/swagger2-spec-builder';
import {expectToFail} from '../support/expect-to-fail';

describe('api', () => {
    const toDiffOutcomeFailure = (diffOutcome: DiffOutcome): DiffOutcomeFailure => {
        assert.ok(diffOutcome.breakingDifferencesFound, `Expected ${diffOutcome} to be failure`);
        return diffOutcome as DiffOutcomeFailure;
    };

    const whenSourceAndDestinationSpecsAreDiffed = (
        sourceSpec: SpecOption, destinationSpec: SpecOption
    ): Promise<DiffOutcome> =>
        OpenApiDiff.diffSpecs({sourceSpec, destinationSpec});

    it('should return errors with code when specs cant be diffed', async () => {
        const sourceSpec = specOptionBuilder
            .withRawContent('{this is not json or yaml')
            .withLocation('source-spec-invalid.json').build();
        const destinationSpec = specOptionBuilder.build();

        const error = await expectToFail(whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec));

        expect(error).toEqual(
            new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_SPEC_DESERIALISER_ERROR',
                'Unable to parse source-spec-invalid.json as a JSON or YAML file')
        );
    });

    it('should include the source and destination spec locations', async () => {
        const sourceSpec = specOptionBuilder.withLocation('source-spec.json').build();
        const destinationSpec = specOptionBuilder.withLocation('destination-spec.json').build();

        const result = await whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(result.sourceSpecDetails.location).toEqual('source-spec.json');
        expect(result.destinationSpecDetails.location).toEqual('destination-spec.json');
    });

    it('should include the inferred spec formats when source is swagger2 and destination is openapi3', async () => {
        const sourceSpec = specOptionBuilder.withContent(swagger2SpecBuilder).build();
        const destinationSpec = specOptionBuilder.withContent(openApi3SpecBuilder).build();

        const result = await whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(result.sourceSpecDetails.format).toEqual('swagger2');
        expect(result.destinationSpecDetails.format).toEqual('openapi3');
    });

    it('should include the inferred spec formats when source is openapi3 and destination is swagger2', async () => {
        const sourceSpec = specOptionBuilder.withContent(openApi3SpecBuilder).build();
        const destinationSpec = specOptionBuilder.withContent(swagger2SpecBuilder).build();

        const result = await whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(result.sourceSpecDetails.format).toEqual('openapi3');
        expect(result.destinationSpecDetails.format).toEqual('swagger2');
    });

    it('should include non breaking differences', async () => {
        const specContents = openapi3SpecsDifferenceBuilder
            .withNonBreakingDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(result.breakingDifferencesFound).toBe(false);
        expect(result.nonBreakingDifferences.length).toEqual(1, 'result.nonBreakingDifferences.length');
        expect(result.unclassifiedDifferences.length).toEqual(0, 'result.unclassifiedDifferences.length');
        expect(result.nonBreakingDifferences[0].type).toEqual('non-breaking');
    });

    it('should include unclassified differences', async () => {
        const specContents = openapi3SpecsDifferenceBuilder
            .withUnclassifiedDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(result.breakingDifferencesFound).toBe(false);
        expect(result.nonBreakingDifferences.length).toEqual(0, 'result.nonBreakingDifferences.length');
        expect(result.unclassifiedDifferences.length).toEqual(1, 'result.unclassifiedDifferences.length');
        expect(result.unclassifiedDifferences[0].type).toEqual('unclassified');
    });

    it('should include breaking differences', async () => {
        const specContents = openapi3SpecsDifferenceBuilder
            .withBreakingDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = toDiffOutcomeFailure(
            await whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec)
        );

        expect(result.breakingDifferencesFound).toBe(true);
        expect(result.nonBreakingDifferences.length).toEqual(0, 'result.nonBreakingDifferences.length');
        expect(result.unclassifiedDifferences.length).toEqual(0, 'result.unclassifiedDifferences.length');
        expect(result.breakingDifferences.length).toEqual(1, 'result.breakingDifferences.length');
        expect(result.breakingDifferences[0].type).toEqual('breaking');
    });
});
