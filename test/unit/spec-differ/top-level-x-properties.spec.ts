import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {DiffEntry} from '../../../lib/openapi-diff/types';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is an edit in an ^x- property at the top level object', () => {

        it('should classify the change as an unclassified edition of the top level ^x- property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'x value'
                })
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'NEW x value'
                })
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW x value',
                printablePath: ['x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                sourceValue: 'x value',
                taxonomy: 'unclassified.edit',
                type: 'edit'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there is an addition of an ^x- property at the top level object', () => {

        it('should classify the change as an unclassified addition of the top level ^x- property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoTopLevelXProperties()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'NEW x value'
                })
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW x value',
                printablePath: ['x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                sourceValue: undefined,
                taxonomy: 'unclassified.add',
                type: 'add'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there is a deletion of an ^x- property at the top level object', () => {

        it('should classify the change as an unclassified deletion of the top level ^x- property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'x value'
                })
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoTopLevelXProperties()
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['x-external-id'],
                scope: 'unclassified',
                severity: 'unclassified',
                sourceValue: 'x value',
                taxonomy: 'unclassified.delete',
                type: 'delete'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there are multiple changes on ^x- properties at the top level object', () => {

        it('should detect and classify ^x- property additions, deletions and editions', () => {

            const parsedSourceSpec = parsedSpecBuilder
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
            const parsedDestinationSpec = parsedSpecBuilder
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

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry1: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['x-deleted-prop'],
                scope: 'unclassified',
                severity: 'unclassified',
                sourceValue: 'x deleted value',
                taxonomy: 'unclassified.delete',
                type: 'delete'
            };
            const expectedDiffEntry2: DiffEntry = {
                destinationValue: 'x edited NEW value',
                printablePath: ['x-edited-prop'],
                scope: 'unclassified',
                severity: 'unclassified',
                sourceValue: 'x edited old value',
                taxonomy: 'unclassified.edit',
                type: 'edit'
            };
            const expectedDiffEntry3: DiffEntry = {
                destinationValue: 'x added value',
                printablePath: ['x-added-prop'],
                scope: 'unclassified',
                severity: 'unclassified',
                sourceValue: undefined,
                taxonomy: 'unclassified.add',
                type: 'add'
            };
            expect(result).toEqual([expectedDiffEntry1, expectedDiffEntry2, expectedDiffEntry3]);
        });
    });
});
