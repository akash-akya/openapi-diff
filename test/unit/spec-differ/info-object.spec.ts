import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {DiffEntry} from '../../../lib/openapi-diff/types';
import {parsedSpecBuilder, parsedSpecInfoBuilder} from '../support/builders/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is an addition in the info property', () => {

        it('should classify the change as a non-breaking addition in the info property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withNoDescription())
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withDescription('NEW spec description'))
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW spec description',
                printablePath: ['info', 'description'],
                scope: 'info.description',
                severity: 'non-breaking',
                sourceValue: undefined,
                taxonomy: 'info.description.add',
                type: 'add'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there is a deletion in the info property', () => {

        it('should classify the change as a non-breaking addition in the info property', () => {

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

            const expectedDiffEntry: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['info', 'contact', 'name'],
                scope: 'info.contact.name',
                severity: 'non-breaking',
                sourceValue: 'contact name',
                taxonomy: 'info.contact.name.delete',
                type: 'delete'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there is an edition in the info property', () => {

        it('should classify the change as a non-breaking edition in the info property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('spec title'))
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('NEW spec title'))
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW spec title',
                printablePath: ['info', 'title'],
                scope: 'info.title',
                severity: 'non-breaking',
                sourceValue: 'spec title',
                taxonomy: 'info.title.edit',
                type: 'edit'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there is an addition of an ^x- property in the info object', () => {

        it('should classify the change as an unclassified addition in the info ^x- property', () => {

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

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW x value',
                printablePath: ['info', 'x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                sourceValue: undefined,
                taxonomy: 'unclassified.add',
                type: 'add'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there is a deletion in an ^x- property in the info object', () => {

        it('should classify the change as an unclassified deletion in the info ^x- property', () => {

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

            const expectedDiffEntry: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['info', 'x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                sourceValue: 'x value',
                taxonomy: 'unclassified.delete',
                type: 'delete'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there is an edition in an ^x- property in the info object', () => {

        it('should classify the change as an unclassified edition in the info ^x- property', () => {

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

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW x value',
                printablePath: ['info', 'x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                sourceValue: 'x value',
                taxonomy: 'unclassified.edit',
                type: 'edit'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });
});
