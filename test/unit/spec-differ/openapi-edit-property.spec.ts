import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {
    DiffChange,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

describe('specDiffer', () => {

    describe('when there is a change in the openapi property', () => {
        const buildSimpleParsedSpecWith = (path: string[], value: string): ParsedSpec => {
            const spec = {
                info: {
                    title: 'spec title',
                    version: 'version'
                },
                openapi: {
                    originalPath: path,
                    parsedValue: value
                }
            };
            return spec;
        };

        describe('generically', () => {

            let results: DiffChange[];

            beforeEach(() => {
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['swagger'], '2.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['swagger'], '2.1');
                results = specDiffer.diff(oldParsedSpec, newParsedSpec);
            });

            it('should classify the change as non-breaking', () => {
                expect(results.length).toBe(1);
                expect(results[0].severity).toEqual('non-breaking');
            });

            it('should locate the scope of the changes in the openapi property', () => {
                expect(results[0].scope).toEqual('openapi.property');
            });

            it('should populate the taxonomy and type of the change as an edition', () => {
                expect(results[0].taxonomy).toEqual('openapi.property.edit');
                expect(results[0].type).toEqual('edit');
            });

            it('should copy the rest of the individual diff attributes across', () => {
                expect(results[0].lhs).toEqual('2.0');
                expect(results[0].rhs).toEqual('2.1');
                expect(results[0].index).toBeNull();
                expect(results[0].item).toBeNull();
            });
        });

        describe('from a Swagger 2.0 spec', () => {

            it('should populate the paths of the change with the original swagger path and the diff one', () => {
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['swagger'], '2.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['swagger'], '2.1');

                const results: DiffChange[] = specDiffer.diff(oldParsedSpec, newParsedSpec);
                expect(results[0].path[0]).toEqual('openapi');
                expect(results[0].path[1]).toEqual('parsedValue');
                expect(results[0].printablePath[0]).toEqual('swagger');
            });
        });

        describe('from an OpenApi 3.0 spec', () => {

            it('should populate the paths of the change with the original openapi path and the diff one', () => {
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['openapi'], '3.0.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['openapi'], '3.0.1');

                const results: DiffChange[] = specDiffer.diff(oldParsedSpec, newParsedSpec);
                expect(results[0].path[0]).toEqual('openapi');
                expect(results[0].path[1]).toEqual('parsedValue');
                expect(results[0].printablePath[0]).toEqual('openapi');
            });
        });
    });
});
