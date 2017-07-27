import specDiffer from '../../../lib/openapi-diff/spec-differ';

import {
    Diff,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

let result: Diff;

describe('specDiffer', () => {

    const buildParsedSpecWithFullInfoObject = (): ParsedSpec => {
        const spec = {
            info: {
                contact: {
                    email: 'contact email',
                    name: 'contact name',
                    url: 'contact url'
                },
                description: 'spec description',
                licence: {
                    name: 'licence name',
                    url: 'licence url'
                },
                termsOfService: 'terms of service',
                title: 'spec title',
                version: 'version'
            },
            openapi: {
                originalPath: ['openapi'],
                parsedValue: '3.0.0'
            }
        };
        return spec;
    };

    describe('when there is a single change in the info object', () => {

        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithFullInfoObject();
            const newParsedSpec = buildParsedSpecWithFullInfoObject();
            newParsedSpec.info.title = 'NEW spec title';
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify a single change in the info object as non-breaking', () => {
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.unclassifiedChanges.length).toEqual(0);
            expect(result.nonBreakingChanges.length).toBe(1);
            expect(result.nonBreakingChanges[0].changeClass).toEqual('non-breaking');
        });

        it('should locate the scope of the change in the info object', () => {
            expect(result.nonBreakingChanges[0].scope).toEqual('info.object');
        });

        it('should populate the taxonomy and type of a single change in the info object as an edition in it', () => {
            expect(result.nonBreakingChanges[0].taxonomy).toEqual('info.object.edit');
            expect(result.nonBreakingChanges[0].type).toEqual('edit');
        });

        it('should populate the paths of a single change in the info object correctly', () => {
            expect(result.nonBreakingChanges[0].path[0]).toEqual('info');
            expect(result.nonBreakingChanges[0].path[1]).toEqual('title');
            expect(result.nonBreakingChanges[0].printablePath[0]).toEqual('info');
            expect(result.nonBreakingChanges[0].printablePath[1]).toEqual('title');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result.nonBreakingChanges[0].lhs).toEqual('spec title');
            expect(result.nonBreakingChanges[0].rhs).toEqual('NEW spec title');
            expect(result.nonBreakingChanges[0].index).toBeNull();
            expect(result.nonBreakingChanges[0].item).toBeNull();
        });
    });

    describe('when there are multiple changes in the info object', () => {

        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithFullInfoObject();
            const newParsedSpec = buildParsedSpecWithFullInfoObject();
            newParsedSpec.info.title = 'NEW spec title';

            if (newParsedSpec.info.contact) {
                newParsedSpec.info.contact.name = 'NEW contact name';
            } else {
                fail('Unexpected mock spec attributes missing');
            }
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify multiple changes in the info object as non-breaking', () => {
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.unclassifiedChanges.length).toEqual(0);
            expect(result.nonBreakingChanges.length).toEqual(2);
            expect(result.nonBreakingChanges[0].changeClass).toEqual('non-breaking');
            expect(result.nonBreakingChanges[1].changeClass).toEqual('non-breaking');
        });

        it('should locate the scope of the changes in the info object', () => {
            expect(result.nonBreakingChanges[0].scope).toEqual('info.object');
            expect(result.nonBreakingChanges[1].scope).toEqual('info.object');
        });

        it('should populate the taxonomy of multiple changes in the info object as an edition to it', () => {
            expect(result.nonBreakingChanges[0].taxonomy).toEqual('info.object.edit');
            expect(result.nonBreakingChanges[0].type).toEqual('edit');
            expect(result.nonBreakingChanges[1].taxonomy).toEqual('info.object.edit');
            expect(result.nonBreakingChanges[1].type).toEqual('edit');
        });

        it('should populate the paths of the multiple changes in the info object correctly', () => {
            expect(result.nonBreakingChanges[0].path[0]).toEqual('info');
            expect(result.nonBreakingChanges[0].path[1]).toEqual('contact');
            expect(result.nonBreakingChanges[0].path[2]).toEqual('name');
            expect(result.nonBreakingChanges[0].printablePath[0]).toEqual('info');
            expect(result.nonBreakingChanges[0].printablePath[1]).toEqual('contact');
            expect(result.nonBreakingChanges[0].printablePath[2]).toEqual('name');

            expect(result.nonBreakingChanges[1].path[0]).toEqual('info');
            expect(result.nonBreakingChanges[1].path[1]).toEqual('title');
            expect(result.nonBreakingChanges[1].printablePath[0]).toEqual('info');
            expect(result.nonBreakingChanges[1].printablePath[1]).toEqual('title');
        });
    });
});
