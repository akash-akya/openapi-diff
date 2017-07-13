import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {
    Diff,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

describe('specDiffer', () => {

    describe('when there is a change in an ^x- property at the top level object', () => {

        it('should classify the change in the x-property as unclassified', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'old x value'
            };

            const newSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'new x value'
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.unclassifiedChanges.length).toEqual(1);
            expect(result.nonBreakingChanges.length).toBe(0);
        });

        it('should populate the type of the change at the top level object as unclassified', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'old x value'
            };

            const newSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'new x value'
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.unclassifiedChanges[0].type).toEqual('unclassified');
        });

        it('should populate the taxonomy of the change at the top level object as unclassified', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'old x value'
            };

            const newSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'new x value'
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.unclassifiedChanges[0].taxonomy).toEqual('zzz.unclassified.change');
        });

        it('should populate the path of a single change in the info object correctly', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'old x value'
            };

            const newSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'new x value'
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.unclassifiedChanges[0].path[0]).toEqual('x-external-id');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'old x value'
            };

            const newSpec: ParsedSpec = {
                info: {
                    title: 'old spec title',
                    version: 'old version'
                },
                'x-external-id': 'new x value'
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.unclassifiedChanges[0].lhs).toEqual('old x value');
            expect(result.unclassifiedChanges[0].rhs).toEqual('new x value');
            expect(result.unclassifiedChanges[0].index).toBeNull();
            expect(result.unclassifiedChanges[0].item).toBeNull();
        });
    });

    describe('when there is a change in an ^x- property in the info object', () => {

        it('should classify a change in an x-property in the info object as unclassified', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'old x value'
                }
            };

            const newSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'new x value'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.unclassifiedChanges.length).toEqual(1);
            expect(result.nonBreakingChanges.length).toBe(0);
        });

        it('should populate the type of a single change in the info object as unclassified', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'old x value'
                }
            };

            const newSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'new x value'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.unclassifiedChanges[0].type).toEqual('unclassified');
        });

        it('should populate the taxonomy of a single change in the info object as unclassified', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'old x value'
                }
            };

            const newSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'new x value'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.unclassifiedChanges[0].taxonomy).toEqual('zzz.unclassified.change');
        });

        it('should populate the path of a single change in the info object correctly', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'old x value'
                }
            };

            const newSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'new x value'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.unclassifiedChanges[0].path[0]).toEqual('info');
            expect(result.unclassifiedChanges[0].path[1]).toEqual('x-external-id');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            const oldSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'old x value'
                }
            };

            const newSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'old contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'old spec title',
                    version: 'old version',
                    'x-external-id': 'new x value'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.unclassifiedChanges[0].lhs).toEqual('old x value');
            expect(result.unclassifiedChanges[0].rhs).toEqual('new x value');
            expect(result.unclassifiedChanges[0].index).toBeNull();
            expect(result.unclassifiedChanges[0].item).toBeNull();
        });
    });
});
