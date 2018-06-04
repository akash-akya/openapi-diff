import * as OpenApiDiff from '../../lib/api';
import {SpecOption, ValidationOutcome} from '../../lib/api-types';
import {openApi3SpecBuilder} from './support/builders/openapi-3-spec-builder';
import {specOptionBuilder} from './support/builders/spec-option-builder';
import {swagger2SpecBuilder} from './support/builders/swagger-2-spec-builder';
import {swagger2SpecsDifferenceBuilder} from './support/builders/swagger2-specs-difference-builder';

describe('api', () => {

    const whenSourceAndDestinationSpecsAreValidated = (
        sourceSpec: SpecOption, destinationSpec: SpecOption
    ): Promise<ValidationOutcome> =>
        OpenApiDiff.validate({sourceSpec, destinationSpec});

    it('should include the source and destination spec locations', async () => {
        const sourceSpec = specOptionBuilder.withLocation('source-spec.json').build();
        const destinationSpec = specOptionBuilder.withLocation('destination-spec.json').build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.sourceSpecDetails.location).toEqual('source-spec.json');
        expect(result.destinationSpecDetails.location).toEqual('destination-spec.json');
    });

    it('should include the inferred spec formats when source is swagger2 and destination is openapi3', async () => {
        const sourceSpec = specOptionBuilder.withContent(swagger2SpecBuilder).build();
        const destinationSpec = specOptionBuilder.withContent(openApi3SpecBuilder).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.sourceSpecDetails.format).toEqual('swagger2');
        expect(result.destinationSpecDetails.format).toEqual('openapi3');
    });

    it('should include the inferred spec formats when source is openapi3 and destination is swagger2', async () => {
        const sourceSpec = specOptionBuilder.withContent(openApi3SpecBuilder).build();
        const destinationSpec = specOptionBuilder.withContent(swagger2SpecBuilder).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.sourceSpecDetails.format).toEqual('openapi3');
        expect(result.destinationSpecDetails.format).toEqual('swagger2');
    });

    it('should include non breaking differences', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withNonBreakingDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.nonBreakingDifferences.length).toEqual(1, 'result.nonBreakingDifferences.length');
        expect(result.unclassifiedDifferences.length).toEqual(0, 'result.unclassifiedDifferences.length');
        expect(result.breakingDifferences.length).toEqual(0, 'result.breakingDifferences.length');
        expect(result.nonBreakingDifferences[0].type).toEqual('non-breaking');
    });

    it('should include unclassified differences', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withUnclassifiedDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.nonBreakingDifferences.length).toEqual(0, 'result.nonBreakingDifferences.length');
        expect(result.unclassifiedDifferences.length).toEqual(1, 'result.unclassifiedDifferences.length');
        expect(result.breakingDifferences.length).toEqual(0, 'result.breakingDifferences.length');
        expect(result.unclassifiedDifferences[0].type).toEqual('unclassified');
    });

    it('should include breaking differences', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withBreakingDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.nonBreakingDifferences.length).toEqual(0, 'result.nonBreakingDifferences.length');
        expect(result.unclassifiedDifferences.length).toEqual(0, 'result.unclassifiedDifferences.length');
        expect(result.breakingDifferences.length).toEqual(1, 'result.breakingDifferences.length');
        expect(result.breakingDifferences[0].type).toEqual('breaking');
    });

    it('should return successful when no differences are found', async () => {
        const sourceSpec = specOptionBuilder.build();
        const destinationSpec = specOptionBuilder.build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.success).toEqual(true, 'success');
    });

    it('should return successful when differences are non breaking and unclassified but not breaking', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withUnclassifiedDifference()
            .withNonBreakingDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.success).toEqual(true, 'success');
    });

    it('should return unsuccessful when at least one breaking difference is found', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withBreakingDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.success).toEqual(false, 'success');
    });

    it('should not include a failureReason when result is successful', async () => {
        const sourceSpec = specOptionBuilder.build();
        const destinationSpec = specOptionBuilder.build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.failureReason).toEqual(undefined);
    });

    it('should include a failureReason when result is unsuccessful', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withBreakingDifference()
            .build();

        const sourceSpec = specOptionBuilder
            .withContent(specContents.source)
            .withLocation('source.json')
            .build();
        const destinationSpec = specOptionBuilder
            .withContent(specContents.destination)
            .withLocation('destination.json')
            .build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.failureReason).toEqual(
            'destination spec "destination.json" introduced breaking changes with respect to source spec "source.json"'
        );
    });
});
