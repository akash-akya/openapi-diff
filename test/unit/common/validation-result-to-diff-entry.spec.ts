import {toDiffEntry} from '../../../lib/openapi-diff/common/validation-result-to-diff-entry';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/validation-result-spec-entity-details-builder';

describe('validation result to diff entry', () => {
    describe('basePath', () => {
        it('should convert edit and breaking to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('edit')
                .withEntity('oad.basePath')
                .withType('breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('basePath')
                        .withValue('basePath info')
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('basePath')
                        .withValue('New basePath info')
                )
                .build();

            const result = toDiffEntry(validationResult);

            expect(result).toEqual({
                destinationValue: 'New basePath info',
                printablePath: ['basePath'],
                severity: 'breaking',
                sourceValue: 'basePath info',
                type: 'edit'
            });
        });

        it('should convert add and breaking to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('add')
                .withEntity('oad.basePath')
                .withType('breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('basePath')
                        .withValue(undefined)
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('basePath')
                        .withValue('New basePath info')
                )
                .build();

            const result = toDiffEntry(validationResult);

            expect(result).toEqual({
                destinationValue: 'New basePath info',
                printablePath: ['basePath'],
                severity: 'breaking',
                sourceValue: undefined,
                type: 'add'
            });
        });

        it('should convert delete and breaking to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('delete')
                .withEntity('oad.basePath')
                .withType('breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('basePath')
                        .withValue('basePath info')
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('basePath')
                        .withValue(undefined)
                )
                .build();

            const result = toDiffEntry(validationResult);

            expect(result).toEqual({
                destinationValue: undefined,
                printablePath: ['basePath'],
                severity: 'breaking',
                sourceValue: 'basePath info',
                type: 'delete'
            });
        });
    });

    describe('host', () => {
        it('should convert edit and breaking to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('edit')
                .withEntity('oad.host')
                .withType('breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('host')
                        .withValue('host info')
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('host')
                        .withValue('new host info')
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'new host info',
                printablePath: ['host'],
                severity: 'breaking',
                sourceValue: 'host info',
                type: 'edit'
            });
        });

        it('should convert add and breaking to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('add')
                .withEntity('oad.host')
                .withType('breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('host')
                        .withValue(undefined)
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('host')
                        .withValue('new host info')
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'new host info',
                printablePath: ['host'],
                severity: 'breaking',
                sourceValue: undefined,
                type: 'add'
            });
        });

        it('should convert delete and breaking to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('delete')
                .withEntity('oad.host')
                .withType('breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('host')
                        .withValue('host info')
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('host')
                        .withValue(undefined)
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: undefined,
                printablePath: ['host'],
                severity: 'breaking',
                sourceValue: 'host info',
                type: 'delete'
            });
        });

    });

    describe('info object', () => {
        it('should convert edit and non-breaking to non-breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('edit')
                .withEntity('oad.info.title')
                .withType('non-breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('info.title')
                        .withValue('title')
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('info.title')
                        .withValue('new title')
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'new title',
                printablePath: ['info', 'title'],
                severity: 'non-breaking',
                sourceValue: 'title',
                type: 'edit'
            });
        });

        it('should convert add and non-breaking to non-breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('add')
                .withEntity('oad.info.description')
                .withType('non-breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('info.description')
                        .withValue(undefined)
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('info.description')
                        .withValue('new description')
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'new description',
                printablePath: ['info', 'description'],
                severity: 'non-breaking',
                sourceValue: undefined,
                type: 'add'
            });
        });

        it('should convert delete and non-breaking to non-breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('delete')
                .withEntity('oad.info.contact.name')
                .withType('non-breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('info.contact.name')
                        .withValue('name')
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('info.contact.name')
                        .withValue(undefined)
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: undefined,
                printablePath: ['info', 'contact', 'name'],
                severity: 'non-breaking',
                sourceValue: 'name',
                type: 'delete'
            });
        });

        describe('x-property', () => {
            it('should convert edit and unclassified to unclassified diff entry', () => {
                const validationResult = validationResultBuilder
                    .withAction('edit')
                    .withEntity('oad.unclassified')
                    .withType('unclassified')
                    .withSourceSpecEntityDetails(
                        specEntityDetailsBuilder
                            .withLocation('info.x-external-id')
                            .withValue('some value')
                    )
                    .withDestinationSpecEntityDetails(
                        specEntityDetailsBuilder
                            .withLocation('info.x-external-id')
                            .withValue('new value')
                    )
                    .build();

                const diffEntry = toDiffEntry(validationResult);

                expect(diffEntry).toEqual({
                    destinationValue: 'new value',
                    printablePath: ['info', 'x-external-id'],
                    severity: 'unclassified',
                    sourceValue: 'some value',
                    type: 'edit'
                });
            });

            it('should convert add and unclassified to unclassified diff entry', () => {
                const validationResult = validationResultBuilder
                    .withAction('add')
                    .withEntity('oad.unclassified')
                    .withType('unclassified')
                    .withSourceSpecEntityDetails(
                        specEntityDetailsBuilder
                            .withLocation('info.x-external-id')
                            .withValue(undefined)
                    )
                    .withDestinationSpecEntityDetails(
                        specEntityDetailsBuilder
                            .withLocation('info.x-external-id')
                            .withValue('new value')
                    )
                    .build();

                const diffEntry = toDiffEntry(validationResult);

                expect(diffEntry).toEqual({
                    destinationValue: 'new value',
                    printablePath: ['info', 'x-external-id'],
                    severity: 'unclassified',
                    sourceValue: undefined,
                    type: 'add'
                });
            });

            it('should convert delete and unclassified to unclassified diff entry', () => {
                const validationResult = validationResultBuilder
                    .withAction('delete')
                    .withEntity('oad.unclassified')
                    .withType('unclassified')
                    .withSourceSpecEntityDetails(
                        specEntityDetailsBuilder
                            .withLocation('info.x-external-id')
                            .withValue('some value')
                    )
                    .withDestinationSpecEntityDetails(
                        specEntityDetailsBuilder
                            .withLocation('info.x-external-id')
                            .withValue(undefined)
                    )
                    .build();

                const diffEntry = toDiffEntry(validationResult);

                expect(diffEntry).toEqual({
                    destinationValue: undefined,
                    printablePath: ['info', 'x-external-id'],
                    severity: 'unclassified',
                    sourceValue: 'some value',
                    type: 'delete'
                });
            });
        });
    });

    describe('openapi', () => {
        it('should convert edit and non-breaking to non-breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('edit')
                .withEntity('oad.openapi')
                .withType('non-breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('swagger')
                        .withValue('2.0')
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('swagger')
                        .withValue('2.1')
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: '2.1',
                printablePath: ['swagger'],
                severity: 'non-breaking',
                sourceValue: '2.0',
                type: 'edit'
            });
        });
    });

    describe('schemes', () => {
        it('should convert item.add and non-breaking to non breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('item.add')
                .withEntity('oad.schemes')
                .withType('non-breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('schemes.0')
                        .withValue(undefined)
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('schemes.0')
                        .withValue('http')
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'http',
                printablePath: ['schemes', '0'],
                severity: 'non-breaking',
                sourceValue: undefined,
                type: 'arrayContent.add'
            });
        });

        it('should convert add and breaking to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('add')
                .withEntity('oad.schemes')
                .withType('breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('schemes')
                        .withValue(undefined)
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('schemes')
                        .withValue([{originalPath: ['schemes', '0'], value: 'https'}])
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: [{originalPath: ['schemes', '0'], value: 'https'}],
                printablePath: ['schemes'],
                severity: 'breaking',
                sourceValue: undefined,
                type: 'add'
            });
        });

        it('should convert item.delete and breaking to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('item.delete')
                .withEntity('oad.schemes')
                .withType('breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('schemes.0')
                        .withValue('http')
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('schemes.0')
                        .withValue(undefined)
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: undefined,
                printablePath: ['schemes', '0'],
                severity: 'breaking',
                sourceValue: 'http',
                type: 'arrayContent.delete'
            });
        });

        it('should convert delete and breaking to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('delete')
                .withEntity('oad.schemes')
                .withType('breaking')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('schemes')
                        .withValue([{originalPath: ['schemes', '0'], value: 'https'}])
                )
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('schemes')
                        .withValue(undefined)
                )
                .build();

            const diffEntry = toDiffEntry(validationResult);

            expect(diffEntry).toEqual({
                destinationValue: undefined,
                printablePath: ['schemes'],
                severity: 'breaking',
                sourceValue: [{originalPath: ['schemes', '0'], value: 'https'}],
                type: 'delete'
            });
        });
    });
});
