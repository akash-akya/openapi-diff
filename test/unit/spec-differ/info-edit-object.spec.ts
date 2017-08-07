import specDiffer from '../../../lib/openapi-diff/spec-differ';

import {
    DiffChange,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

let results: DiffChange[];

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
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify a single change in the info object as non-breaking', () => {
            expect(results.length).toBe(1);
            expect(results[0].severity).toEqual('non-breaking');
        });

        it('should locate the scope of the change in the info object', () => {
            expect(results[0].scope).toEqual('info.object');
        });

        it('should populate the taxonomy and type of a single change in the info object as an edition in it', () => {
            expect(results[0].taxonomy).toEqual('info.object.edit');
            expect(results[0].type).toEqual('edit');
        });

        it('should populate the paths of a single change in the info object correctly', () => {
            expect(results[0].path[0]).toEqual('info');
            expect(results[0].path[1]).toEqual('title');
            expect(results[0].printablePath[0]).toEqual('info');
            expect(results[0].printablePath[1]).toEqual('title');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toEqual('spec title');
            expect(results[0].rhs).toEqual('NEW spec title');
            expect(results[0].index).toBeUndefined();
            expect(results[0].item).toBeUndefined();
            expect(results[0].kind).toEqual('E');
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
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify multiple changes in the info object as non-breaking', () => {
            expect(results.length).toEqual(2);
            expect(results[0].severity).toEqual('non-breaking');
            expect(results[1].severity).toEqual('non-breaking');
        });

        it('should locate the scope of the changes in the info object', () => {
            expect(results[0].scope).toEqual('info.object');
            expect(results[1].scope).toEqual('info.object');
        });

        it('should populate the taxonomy of multiple changes in the info object as an edition to it', () => {
            expect(results[0].taxonomy).toEqual('info.object.edit');
            expect(results[0].type).toEqual('edit');
            expect(results[1].taxonomy).toEqual('info.object.edit');
            expect(results[1].type).toEqual('edit');
        });

        it('should populate the paths of the multiple changes in the info object correctly', () => {
            expect(results[0].path[0]).toEqual('info');
            expect(results[0].path[1]).toEqual('contact');
            expect(results[0].path[2]).toEqual('name');
            expect(results[0].printablePath[0]).toEqual('info');
            expect(results[0].printablePath[1]).toEqual('contact');
            expect(results[0].printablePath[2]).toEqual('name');

            expect(results[1].path[0]).toEqual('info');
            expect(results[1].path[1]).toEqual('title');
            expect(results[1].printablePath[0]).toEqual('info');
            expect(results[1].printablePath[1]).toEqual('title');
        });
    });
});
