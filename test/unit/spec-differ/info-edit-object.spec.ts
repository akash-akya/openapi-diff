import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder, parsedSpecInfoBuilder} from '../support/parsed-spec-builder';

import {
    DiffEntrySeverity,
    DiffEntryTaxonomy,
    DiffEntryType
} from '../../../lib/openapi-diff/types';

describe('specDiffer', () => {

    describe('when there is an edition in the info property', () => {

        it('should classify the change as a non-breaking edition in the info property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('spec title'))
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('NEW spec title'))
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(jasmine.objectContaining({
                newValue: 'NEW spec title',
                oldValue: 'spec title',
                printablePath: ['info', 'title'],
                scope: 'info.object',
                severity: 'non-breaking' as DiffEntrySeverity,
                taxonomy: 'info.object.edit' as DiffEntryTaxonomy,
                type: 'edit' as DiffEntryType
            }));
        });
    });

    describe('when there are multiple editions in the info property', () => {

        it('should classify the change as a non-breaking edition in the info property', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('spec title')
                    .withVersion('spec version'))
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('NEW spec title')
                    .withVersion('NEW spec version'))
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(jasmine.objectContaining({
                newValue: 'NEW spec title',
                oldValue: 'spec title',
                printablePath: ['info', 'title'],
                scope: 'info.object',
                severity: 'non-breaking' as DiffEntrySeverity,
                taxonomy: 'info.object.edit' as DiffEntryTaxonomy,
                type: 'edit' as DiffEntryType
            }));
            expect(result[1]).toEqual(jasmine.objectContaining({
                newValue: 'NEW spec version',
                oldValue: 'spec version',
                printablePath: ['info', 'version'],
                scope: 'info.object',
                severity: 'non-breaking' as DiffEntrySeverity,
                taxonomy: 'info.object.edit' as DiffEntryTaxonomy,
                type: 'edit' as DiffEntryType
            }));
        });
    });
});
