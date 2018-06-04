import {specFinder} from '../../../lib/openapi-diff/spec-finder';
import {diffResultBuilder} from '../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/diff-result-spec-entity-details-builder';
import {parsedSpecBuilder, parsedSpecInfoBuilder} from '../support/builders/parsed-spec-builder';

describe('specFinder/info property', () => {

    describe('when there is an addition in the info property', () => {

        it('should return a non-breaking add difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withNoDescription())
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withDescription('NEW spec description'))
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = diffResultBuilder
                .withAction('add')
                .withCode('info.description.add')
                .withType('non-breaking')
                .withEntity('info.description')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.description')
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.description')
                    .withValue('NEW spec description'))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when there is a deletion in the info property', () => {

        it('should return a non-breaking remove difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withContact({
                        name: 'email',
                        originalPath: ['info', 'contact', 'email'],
                        value: 'contact email'
                    }, {
                        name: 'name',
                        originalPath: ['info', 'contact', 'name'],
                        value: 'contact name'
                    }, {
                        name: 'url',
                        originalPath: ['info', 'contact', 'url'],
                        value: 'contact url'
                    }))
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withContact({
                        name: 'email',
                        originalPath: ['info', 'contact', 'email'],
                        value: 'contact email'
                    }, {
                        name: 'name',
                        originalPath: ['info', 'contact', 'name'],
                        value: undefined
                    }, {
                        name: 'url',
                        originalPath: ['info', 'contact', 'url'],
                        value: 'contact url'
                    }))
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = diffResultBuilder
                .withAction('remove')
                .withCode('info.contact.name.remove')
                .withType('non-breaking')
                .withEntity('info.contact.name')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.contact.name')
                    .withValue('contact name'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.contact.name')
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when there is an edition in the info property', () => {

        it('should return non-breaking add and remove differences', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('spec title'))
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('NEW spec title'))
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const baseDiffResult = diffResultBuilder
                .withType('non-breaking')
                .withEntity('info.title')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.title')
                    .withValue('spec title'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.title')
                    .withValue('NEW spec title'));

            expect(result).toEqual([
                baseDiffResult.withAction('add').withCode('info.title.add').build(),
                baseDiffResult.withAction('remove').withCode('info.title.remove').build()
            ]);
        });
    });

    describe('^x- properties in the info object', () => {
        const xPropertyDiffResultBuilder = diffResultBuilder
            .withSource('openapi-diff')
            .withEntity('unclassified');

        it('should return an unclassified difference when there is an addition', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder)
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'NEW x value'
                    }))
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = xPropertyDiffResultBuilder
                .withAction('add')
                .withCode('unclassified.add')
                .withType('unclassified')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.x-external-id')
                    .withValue('NEW x value'))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });

        it('should return an unclassified remove difference when there is a deletion', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'x value'
                    }))
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder)
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = xPropertyDiffResultBuilder
                .withAction('remove')
                .withCode('unclassified.remove')
                .withType('unclassified')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.x-external-id')
                    .withValue('x value'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });

        it('should return unclassified add and remove differences when there is an edition', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'x value'
                    }))
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'NEW x value'
                    }))
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const baseDiffResult = xPropertyDiffResultBuilder
                .withType('unclassified')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.x-external-id')
                    .withValue('x value'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('info.x-external-id')
                    .withValue('NEW x value'));

            expect(result).toEqual([
                baseDiffResult.withAction('add').withCode('unclassified.add').build(),
                baseDiffResult.withAction('remove').withCode('unclassified.remove').build()
            ]);
        });
    });
});
