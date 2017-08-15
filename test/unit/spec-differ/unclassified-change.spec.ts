import specDiffer from '../../../lib/openapi-diff/spec-differ';
import { parsedSpecBuilder, parsedSpecInfoBuilder } from '../support/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is an edit in an ^x- property at the top level object', () => {

        it('should classify the change as an unclassified edition of the top level ^x- property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'x value'
                })
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'NEW x value'
                })
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW x value',
                oldValue: 'x value',
                printablePath: ['x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                taxonomy: 'unclassified.edit',
                type: 'edit'
            });
        });
    });

    describe('when there is an addition of an ^x- property at the top level object', () => {

        it('should classify the change as an unclassified addition of the top level ^x- property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withNoTopLevelXProperties()
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'NEW x value'
                })
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW x value',
                oldValue: undefined,
                printablePath: ['x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                taxonomy: 'unclassified.add',
                type: 'add'
            });
        });
    });

    describe('when there is a change in an ^x- property in the info object', () => {

        xit('should classify the change as an unclassified edition in the info ^x- property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty('x-external-id', 'x value'))
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty('x-external-id', 'NEW x value'))
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW x value',
                oldValue: 'x value',
                printablePath: ['info', 'x-external-id'],
                scope: 'unclassified.change',
                severity: 'unclassified',
                taxonomy: 'unclassified.edit',
                type: 'edit'
            });
        });
    });
});
