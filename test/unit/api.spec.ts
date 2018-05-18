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

    it('should include found differences of type info', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withInfoDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.info.length).toEqual(1, 'result.info.length');
        expect(result.warnings.length).toEqual(0, 'result.warnings.length');
        expect(result.errors.length).toEqual(0, 'result.error.length');
        expect(result.info[0].type).toEqual('info');
    });

    it('should include found differences of type warning', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withWarningDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.info.length).toEqual(0, 'result.info.length');
        expect(result.warnings.length).toEqual(1, 'result.warnings.length');
        expect(result.errors.length).toEqual(0, 'result.error.length');
        expect(result.warnings[0].type).toEqual('warning');
    });

    it('should include found differences of type error', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withErrorDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.info.length).toEqual(0, 'result.info.length');
        expect(result.warnings.length).toEqual(0, 'result.warnings.length');
        expect(result.errors.length).toEqual(1, 'result.error.length');
        expect(result.errors[0].type).toEqual('error');
    });

    it('should return successful when no differences are found', async () => {
        const sourceSpec = specOptionBuilder.build();
        const destinationSpec = specOptionBuilder.build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.success).toEqual(true, 'success');
    });

    it('should return successful when info and warning differences are found but no errors', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withWarningDifference()
            .withInfoDifference()
            .build();

        const sourceSpec = specOptionBuilder.withContent(specContents.source).build();
        const destinationSpec = specOptionBuilder.withContent(specContents.destination).build();

        const result = await whenSourceAndDestinationSpecsAreValidated(sourceSpec, destinationSpec);

        expect(result.success).toEqual(true, 'success');
    });

    it('should return unsuccessful when at least one error difference is found', async () => {
        const specContents = swagger2SpecsDifferenceBuilder
            .withErrorDifference()
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
            .withErrorDifference()
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
