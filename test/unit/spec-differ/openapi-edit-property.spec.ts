import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {
    Diff,
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

            let result: Diff;

            beforeEach(() => {
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['swagger'], '2.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['swagger'], '2.1');
                result = specDiffer.diff(oldParsedSpec, newParsedSpec);
            });

            it('should classify the change as non-breaking', () => {
                expect(result.breakingChanges.length).toEqual(0);
                expect(result.unclassifiedChanges.length).toEqual(0);
                expect(result.nonBreakingChanges.length).toBe(1);
                expect(result.nonBreakingChanges[0].changeClass).toEqual('non-breaking');
            });

            it('should populate the taxonomy of the change as an edition', () => {
                expect(result.nonBreakingChanges[0].taxonomy).toEqual('openapi.property.edit');
            });

            it('should copy the rest of the individual diff attributes across', () => {
                expect(result.nonBreakingChanges[0].lhs).toEqual('2.0');
                expect(result.nonBreakingChanges[0].rhs).toEqual('2.1');
                expect(result.nonBreakingChanges[0].index).toBeNull();
                expect(result.nonBreakingChanges[0].item).toBeNull();
            });
        });

        describe('from a Swagger 2.0 spec', () => {

            it('should populate the paths of the change with the original swagger path and the diff one', () => {
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['swagger'], '2.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['swagger'], '2.1');

                const result: Diff = specDiffer.diff(oldParsedSpec, newParsedSpec);
                expect(result.nonBreakingChanges[0].path[0]).toEqual('openapi');
                expect(result.nonBreakingChanges[0].path[1]).toEqual('parsedValue');
                expect(result.nonBreakingChanges[0].printablePath[0]).toEqual('swagger');
            });
        });

        describe('from an OpenApi 3.0 spec', () => {

            it('should populate the paths of the change with the original openapi path and the diff one', () => {
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['openapi'], '3.0.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWith(['openapi'], '3.0.1');

                const result: Diff = specDiffer.diff(oldParsedSpec, newParsedSpec);
                expect(result.nonBreakingChanges[0].path[0]).toEqual('openapi');
                expect(result.nonBreakingChanges[0].path[1]).toEqual('parsedValue');
                expect(result.nonBreakingChanges[0].printablePath[0]).toEqual('openapi');
            });
        });
    });
});
