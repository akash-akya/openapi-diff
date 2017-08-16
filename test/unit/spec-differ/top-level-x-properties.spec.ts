import specDiffer from '../../../lib/openapi-diff/spec-differ';
import { parsedSpecBuilder } from '../support/parsed-spec-builder';

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

    describe('when there is a deletion of an ^x- property at the top level object', () => {

        it('should classify the change as an unclassified deletion of the top level ^x- property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'x value'
                })
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withNoTopLevelXProperties()
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: undefined,
                oldValue: 'x value',
                printablePath: ['x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                taxonomy: 'unclassified.delete',
                type: 'delete'
            });
        });
    });

    describe('when there are multiple changes on ^x- properties at the top level object', () => {

        it('should detect and classify ^x- property additions, deletions and editions', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-deleted-prop',
                    originalPath: ['x-deleted-prop'],
                    value: 'x deleted value'
                })
                .withTopLevelXProperty({
                    name: 'x-edited-prop',
                    originalPath: ['x-edited-prop'],
                    value: 'x edited old value'
                })
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-added-prop',
                    originalPath: ['x-added-prop'],
                    value: 'x added value'
                })
                .withTopLevelXProperty({
                    name: 'x-edited-prop',
                    originalPath: ['x-edited-prop'],
                    value: 'x edited NEW value'
                })
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(3);
            expect(result[0]).toEqual({
                newValue: undefined,
                oldValue: 'x deleted value',
                printablePath: ['x-deleted-prop'],
                scope: 'unclassified',
                severity: 'unclassified',
                taxonomy: 'unclassified.delete',
                type: 'delete'
            });
            expect(result[1]).toEqual({
                newValue: 'x edited NEW value',
                oldValue: 'x edited old value',
                printablePath: ['x-edited-prop'],
                scope: 'unclassified',
                severity: 'unclassified',
                taxonomy: 'unclassified.edit',
                type: 'edit'
            });
            expect(result[2]).toEqual({
                newValue: 'x added value',
                oldValue: undefined,
                printablePath: ['x-added-prop'],
                scope: 'unclassified',
                severity: 'unclassified',
                taxonomy: 'unclassified.add',
                type: 'add'
            });
        });
    });
});
