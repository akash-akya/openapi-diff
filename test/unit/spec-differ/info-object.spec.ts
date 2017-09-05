import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder, parsedSpecInfoBuilder} from '../support/builders/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is an addition in the info property', () => {

        it('should classify the change as a non-breaking addition in the info property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withNoDescription())
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withDescription('NEW spec description'))
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW spec description',
                oldValue: undefined,
                printablePath: ['info', 'description'],
                scope: 'info.description',
                severity: 'non-breaking',
                taxonomy: 'info.description.add',
                type: 'add'
            });
        });
    });

    describe('when there is a deletion in the info property', () => {

        it('should classify the change as a non-breaking addition in the info property', () => {

            const oldParsedSpec = parsedSpecBuilder
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
            const newParsedSpec = parsedSpecBuilder
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

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: undefined,
                oldValue: 'contact name',
                printablePath: ['info', 'contact', 'name'],
                scope: 'info.contact.name',
                severity: 'non-breaking',
                taxonomy: 'info.contact.name.delete',
                type: 'delete'
            });
        });
    });

    describe('when there is an edition in the info property', () => {

        it('should classify the change as a non-breaking edition in the info property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('spec title'))
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('NEW spec title'))
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW spec title',
                oldValue: 'spec title',
                printablePath: ['info', 'title'],
                scope: 'info.title',
                severity: 'non-breaking',
                taxonomy: 'info.title.edit',
                type: 'edit'
            });
        });
    });

    describe('when there is an addition of an ^x- property in the info object', () => {

        it('should classify the change as an unclassified addition in the info ^x- property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder)
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'NEW x value'
                    }))
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW x value',
                oldValue: undefined,
                printablePath: ['info', 'x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                taxonomy: 'unclassified.add',
                type: 'add'
            });
        });
    });

    describe('when there is a deletion in an ^x- property in the info object', () => {

        it('should classify the change as an unclassified deletion in the info ^x- property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'x value'
                    }))
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder)
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: undefined,
                oldValue: 'x value',
                printablePath: ['info', 'x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                taxonomy: 'unclassified.delete',
                type: 'delete'
            });
        });
    });

    describe('when there is an edition in an ^x- property in the info object', () => {

        it('should classify the change as an unclassified edition in the info ^x- property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'x value'
                    }))
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'NEW x value'
                    }))
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW x value',
                oldValue: 'x value',
                printablePath: ['info', 'x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                taxonomy: 'unclassified.edit',
                type: 'edit'
            });
        });
    });
});
