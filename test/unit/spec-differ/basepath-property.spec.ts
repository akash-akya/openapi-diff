import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {DiffEntry} from '../../../lib/openapi-diff/types';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is an edition in the basePath property', () => {

        it('should classify the change as a breaking edition in the basePath property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW basePath info',
                printablePath: ['basePath'],
                scope: 'basePath',
                severity: 'breaking',
                sourceValue: 'basePath info',
                taxonomy: 'basePath.edit',
                type: 'edit'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when the basePath property is added in the new spec', () => {

        it('should classify the change as a breaking addition of the basePath property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW basePath info',
                printablePath: ['basePath'],
                scope: 'basePath',
                severity: 'breaking',
                sourceValue: undefined,
                taxonomy: 'basePath.add',
                type: 'add'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when the basePath property is deleted in the new spec', () => {

        it('should classify the change as a breaking deletion of the basePath property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('OLD basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['basePath'],
                scope: 'basePath',
                severity: 'breaking',
                sourceValue: 'OLD basePath info',
                taxonomy: 'basePath.delete',
                type: 'delete'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });
});
