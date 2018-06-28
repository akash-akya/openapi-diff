import * as assert from 'assert';
import * as OpenApiDiff from '../../lib/api';
import {DiffOutcome, DiffOutcomeFailure, SpecOption} from '../../lib/api-types';
import {OpenApiDiffErrorImpl} from '../../lib/common/open-api-diff-error-impl';
import {openApi3SpecBuilder} from '../support/builders/openapi-3-spec-builder';
import {specOptionBuilder} from '../support/builders/spec-option-builder';
import {swagger2SpecBuilder} from '../support/builders/swagger-2-spec-builder';
import {swagger2SpecsDifferenceBuilder} from '../support/builders/swagger2-specs-difference-builder';
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

    describe('spec content parsing', () => {
        it('should return an error when unable to parse the source spec contents as json or yaml', async () => {
            const sourceSpec = specOptionBuilder
                .withRawContent('{this is not json or yaml')
                .withLocation('source-spec-invalid.json').build();
            const destinationSpec = specOptionBuilder.build();

            const error = await expectToFail(whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec));

            expect(error).toEqual(
                new OpenApiDiffErrorImpl(
                    'openapi-diff.specdeserialiser.error',
                    'Unable to parse source-spec-invalid.json as a JSON or YAML file')
            );
        });

        it('should return an error when unable to parse the destination spec contents as json or yaml', async () => {
            const sourceSpec = specOptionBuilder.build();
            const destinationSpec = specOptionBuilder
                .withRawContent('{this is not json or yaml')
                .withLocation('destination-spec-invalid.json').build();

            const error = await expectToFail(whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec));

            expect(error).toEqual(
                new OpenApiDiffErrorImpl(
                    'openapi-diff.specdeserialiser.error',
                    'Unable to parse destination-spec-invalid.json as a JSON or YAML file')
            );
        });

        it('should load the specs as yaml if content is yaml but not json', async () => {
            const swagger2YamlSpec = '' +
                'info: \n' +
                '  title: spec title\n' +
                '  version: spec version\n' +
                'paths: {}\n' +
                'swagger: "2.0"\n';

            const sourceSpec = specOptionBuilder.withRawContent(swagger2YamlSpec).build();
            const destinationSpec = specOptionBuilder.withRawContent(swagger2YamlSpec).build();

            const result = await whenSourceAndDestinationSpecsAreDiffed(sourceSpec, destinationSpec);

            expect(result.breakingDifferencesFound).toBeFalsy();
        });

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
        const specContents = swagger2SpecsDifferenceBuilder
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
        const specContents = swagger2SpecsDifferenceBuilder
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
        const specContents = swagger2SpecsDifferenceBuilder
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
