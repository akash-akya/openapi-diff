import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder} from '../support/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is an edition in the host property', () => {

        it('should classify the change as a breaking edition in the host property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withHost('host info')
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withHost('NEW host info')
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW host info',
                oldValue: 'host info',
                printablePath: ['host'],
                scope: 'host',
                severity: 'breaking',
                taxonomy: 'host.edit',
                type: 'edit'
            });
        });
    });

    describe('when the host property is added in the new spec', () => {

        it('should classify the change as a breaking addition of the host property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withNoHost()
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withHost('NEW host info')
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW host info',
                oldValue: undefined,
                printablePath: ['host'],
                scope: 'host',
                severity: 'breaking',
                taxonomy: 'host.add',
                type: 'add'
            });
        });
    });

    describe('when the host property is deleted in the new spec', () => {

        it('should classify the change as a breaking deletion of the host property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withHost('OLD host info')
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withNoHost()
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: undefined,
                oldValue: 'OLD host info',
                printablePath: ['host'],
                scope: 'host',
                severity: 'breaking',
                taxonomy: 'host.delete',
                type: 'delete'
            });
        });
    });
});
