import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder, parsedSpecInfoBuilder} from '../support/builders/parsed-spec-builder';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/validation-result-spec-entity-details-builder';

describe('specDiffer/info property', () => {

    describe('when there is an addition in the info property', () => {

        it('should return an add difference of type info', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withNoDescription())
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withDescription('NEW spec description'))
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = validationResultBuilder
                .withAction('add')
                .withType('info')
                .withEntity('oad.info.description')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.description')
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.description')
                    .withValue('NEW spec description'))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when there is a deletion in the info property', () => {

        it('should return a delete difference of type info', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withContact({
                        name: 'email',
                        originalPath: ['info', 'contact', 'email'],
                        value: 'contact email'
                    }, {
                        name: 'name',
                        originalPath: ['info', 'contact', 'name'],
                        value: 'contact name'
                    }, {
                        name: 'url',
                        originalPath: ['info', 'contact', 'url'],
                        value: 'contact url'
                    }))
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withContact({
                        name: 'email',
                        originalPath: ['info', 'contact', 'email'],
                        value: 'contact email'
                    }, {
                        name: 'name',
                        originalPath: ['info', 'contact', 'name'],
                        value: undefined
                    }, {
                        name: 'url',
                        originalPath: ['info', 'contact', 'url'],
                        value: 'contact url'
                    }))
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = validationResultBuilder
                .withAction('delete')
                .withType('info')
                .withEntity('oad.info.contact.name')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.contact.name')
                    .withValue('contact name'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.contact.name')
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when there is an edition in the info property', () => {

        it('should return an edit difference of type info', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('spec title'))
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('NEW spec title'))
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = validationResultBuilder
                .withAction('edit')
                .withType('info')
                .withEntity('oad.info.title')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.title')
                    .withValue('spec title'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.title')
                    .withValue('NEW spec title'))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('^x- properties in the info object', () => {
        const xPropertyValidationResultBuilder = validationResultBuilder
            .withSource('openapi-diff')
            .withEntity('oad.unclassified');

        it('should return an add difference of type warning when there is an addition of an ^x- property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder)
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'NEW x value'
                    }))
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = xPropertyValidationResultBuilder
                .withAction('add')
                .withType('warning')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.x-external-id')
                    .withValue('NEW x value'))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });

        it('should return a delete difference of type warning when there is a deletion of an ^x- property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'x value'
                    }))
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder)
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = xPropertyValidationResultBuilder
                .withAction('delete')
                .withType('warning')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.x-external-id')
                    .withValue('x value'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });

        it('should return an edit difference of type warning when there is an edition of an ^x- property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'x value'
                    }))
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'NEW x value'
                    }))
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = xPropertyValidationResultBuilder
                .withAction('edit')
                .withType('warning')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.x-external-id')
                    .withValue('x value'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.x-external-id')
                    .withValue('NEW x value'))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });
});
