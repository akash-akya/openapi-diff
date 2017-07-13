import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {
    Diff,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

describe('specDiffer', () => {

    describe('when there is a single change in the info object', () => {

        it('should classify a single change in the info object as non-breaking', () => {
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
                    version: 'old version'
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
                    title: 'new spec title',
                    version: 'old version'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.unclassifiedChanges.length).toEqual(0);
            expect(result.nonBreakingChanges.length).toBe(1);
        });

        it('should populate the type of a single change in the info object as non-breaking', () => {
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
                    version: 'old version'
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
                    title: 'new spec title',
                    version: 'old version'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.nonBreakingChanges[0].type).toEqual('non-breaking');
        });

        it('should populate the taxonomy of a single change in the info object as an edition in it', () => {
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
                    version: 'old version'
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
                    title: 'new spec title',
                    version: 'old version'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.nonBreakingChanges[0].taxonomy).toEqual('info.object.edit');
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
                    version: 'old version'
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
                    title: 'new spec title',
                    version: 'old version'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.nonBreakingChanges[0].path[0]).toEqual('info');
            expect(result.nonBreakingChanges[0].path[1]).toEqual('title');
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
                    version: 'old version'
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
                    title: 'new spec title',
                    version: 'old version'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.nonBreakingChanges[0].lhs).toEqual('old spec title');
            expect(result.nonBreakingChanges[0].rhs).toEqual('new spec title');
            expect(result.nonBreakingChanges[0].index).toBeNull();
            expect(result.nonBreakingChanges[0].item).toBeNull();
        });
    });

    describe('when there are multiple changes in the info object', () => {

        it('should classify multiple changes in the info object as non-breaking', () => {
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
                    version: 'old version'
                }
            };

            const newSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'new contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'new spec title',
                    version: 'old version'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.unclassifiedChanges.length).toEqual(0);
            expect(result.nonBreakingChanges.length).toEqual(2);
        });

        it('should populate the types of multiple changes in the info object as non-breaking', () => {
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
                    version: 'old version'
                }
            };

            const newSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'new contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'new spec title',
                    version: 'old version'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.nonBreakingChanges[0].type).toEqual('non-breaking');
            expect(result.nonBreakingChanges[1].type).toEqual('non-breaking');
        });

        it('should populate the taxonomy of multiple changes in the info object as an edition to it', () => {
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
                    version: 'old version'
                }
            };

            const newSpec: ParsedSpec = {
                info: {
                    contact: {
                        email: 'old contact email',
                        name: 'new contact name',
                        url: 'old contact url'
                    },
                    description: 'old spec description',
                    licence: {
                        name: 'old licence name',
                        url: 'old licence url'
                    },
                    termsOfService: 'old terms of service',
                    title: 'new spec title',
                    version: 'old version'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);
            expect(result.nonBreakingChanges[0].taxonomy).toEqual('info.object.edit');
            expect(result.nonBreakingChanges[1].taxonomy).toEqual('info.object.edit');
        });

        it('should populate the path of the multiple changes in the info object correctly', () => {
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
                    version: 'old version'
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
                    title: 'new spec title',
                    version: 'old version'
                }
            };

            const result: Diff = specDiffer.diff(oldSpec, newSpec);

            expect(result.nonBreakingChanges[0].path[0]).toEqual('info');
            expect(result.nonBreakingChanges[0].path[1]).toEqual('title');
        });
    });

    it('should populate the path of the multiple changes in the info object correctly when nested', () => {
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
                version: 'old version'
            }
        };

        const newSpec: ParsedSpec = {
            info: {
                contact: {
                    email: 'old contact email',
                    name: 'new contact name',
                    url: 'old contact url'
                },
                description: 'old spec description',
                licence: {
                    name: 'old licence name',
                    url: 'old licence url'
                },
                termsOfService: 'old terms of service',
                title: 'old spec title',
                version: 'old version'
            }
        };

        const result: Diff = specDiffer.diff(oldSpec, newSpec);

        expect(result.nonBreakingChanges[0].path[0]).toEqual('info');
        expect(result.nonBreakingChanges[0].path[1]).toEqual('contact');
        expect(result.nonBreakingChanges[0].path[2]).toEqual('name');
    });
});
