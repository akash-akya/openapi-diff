import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {DiffEntry} from '../../../lib/openapi-diff/types';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is an edition in the host property', () => {

        it('should classify the change as a breaking edition in the host property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withHost('host info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withHost('NEW host info')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW host info',
                printablePath: ['host'],
                scope: 'host',
                severity: 'breaking',
                sourceValue: 'host info',
                taxonomy: 'host.edit',
                type: 'edit'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when the host property is added in the new spec', () => {

        it('should classify the change as a breaking addition of the host property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoHost()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withHost('NEW host info')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'NEW host info',
                printablePath: ['host'],
                scope: 'host',
                severity: 'breaking',
                sourceValue: undefined,
                taxonomy: 'host.add',
                type: 'add'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when the host property is deleted in the new spec', () => {

        it('should classify the change as a breaking deletion of the host property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withHost('OLD host info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoHost()
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['host'],
                scope: 'host',
                severity: 'breaking',
                sourceValue: 'OLD host info',
                taxonomy: 'host.delete',
                type: 'delete'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });
});
