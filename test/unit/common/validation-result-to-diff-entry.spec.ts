import {toDiffEntry} from '../../../lib/openapi-diff/common/validation-result-to-diff-entry';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/validation-result-spec-entity-details-builder';

describe('validation result to diff entry', () => {
    describe('basePath', () => {
        it('should convert edit and error to breaking diff entry', () => {
            const errorEditBasePathValidationResult = validationResultBuilder
                .withAction('edit')
                .withEntity('oad.basePath')
                .withType('error')
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

            const result = toDiffEntry(errorEditBasePathValidationResult);

            expect(result).toEqual({
                destinationValue: 'New basePath info',
                printablePath: ['basePath'],
                scope: 'basePath',
                severity: 'breaking',
                sourceValue: 'basePath info',
                taxonomy: 'basePath.edit',
                type: 'edit'
            });
        });

        it('should convert add and error to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('add')
                .withEntity('oad.basePath')
                .withType('error')
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
                scope: 'basePath',
                severity: 'breaking',
                sourceValue: undefined,
                taxonomy: 'basePath.add',
                type: 'add'
            });
        });

        it('should convert delete and error to breaking diff entry', () => {
            const validationResult = validationResultBuilder
                .withAction('delete')
                .withEntity('oad.basePath')
                .withType('error')
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
                scope: 'basePath',
                severity: 'breaking',
                sourceValue: 'basePath info',
                taxonomy: 'basePath.delete',
                type: 'delete'
            });
        });
    });

    describe('host', () => {
        it('should convert edit and error to breaking diff entry', () => {
            const errorEditHostValidationResult = validationResultBuilder
                .withAction('edit')
                .withEntity('oad.host')
                .withType('error')
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

            const diffEntry = toDiffEntry(errorEditHostValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'new host info',
                printablePath: ['host'],
                scope: 'host',
                severity: 'breaking',
                sourceValue: 'host info',
                taxonomy: 'host.edit',
                type: 'edit'
            });
        });

        it('should convert add and error to breaking diff entry', () => {
            const errorEditHostValidationResult = validationResultBuilder
                .withAction('add')
                .withEntity('oad.host')
                .withType('error')
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

            const diffEntry = toDiffEntry(errorEditHostValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'new host info',
                printablePath: ['host'],
                scope: 'host',
                severity: 'breaking',
                sourceValue: undefined,
                taxonomy: 'host.add',
                type: 'add'
            });
        });

        it('should convert delete and error to breaking diff entry', () => {
            const errorEditHostValidationResult = validationResultBuilder
                .withAction('delete')
                .withEntity('oad.host')
                .withType('error')
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

            const diffEntry = toDiffEntry(errorEditHostValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: undefined,
                printablePath: ['host'],
                scope: 'host',
                severity: 'breaking',
                sourceValue: 'host info',
                taxonomy: 'host.delete',
                type: 'delete'
            });
        });

    });

    describe('info object', () => {
        it('should convert edit and info to non-breaking diff entry', () => {
            const infoEditTitleValidationResult = validationResultBuilder
                .withAction('edit')
                .withEntity('oad.info.title')
                .withType('info')
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

            const diffEntry = toDiffEntry(infoEditTitleValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'new title',
                printablePath: ['info', 'title'],
                scope: 'info.title',
                severity: 'non-breaking',
                sourceValue: 'title',
                taxonomy: 'info.title.edit',
                type: 'edit'
            });
        });

        it('should convert add and info to non-breaking diff entry', () => {
            const infoAddDescriptionValidationResult = validationResultBuilder
                .withAction('add')
                .withEntity('oad.info.description')
                .withType('info')
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

            const diffEntry = toDiffEntry(infoAddDescriptionValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'new description',
                printablePath: ['info', 'description'],
                scope: 'info.description',
                severity: 'non-breaking',
                sourceValue: undefined,
                taxonomy: 'info.description.add',
                type: 'add'
            });
        });

        it('should convert delete and info to non-breaking diff entry', () => {
            const infoDeleteContactNameValidationResult = validationResultBuilder
                .withAction('delete')
                .withEntity('oad.info.contact.name')
                .withType('info')
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

            const diffEntry = toDiffEntry(infoDeleteContactNameValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: undefined,
                printablePath: ['info', 'contact', 'name'],
                scope: 'info.contact.name',
                severity: 'non-breaking',
                sourceValue: 'name',
                taxonomy: 'info.contact.name.delete',
                type: 'delete'
            });
        });

        describe('x-property', () => {
            it('should convert edit and warning to unclassified diff entry', () => {
                const warningEditXPropertyValidationResult = validationResultBuilder
                    .withAction('edit')
                    .withEntity('oad.unclassified')
                    .withType('warning')
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

                const diffEntry = toDiffEntry(warningEditXPropertyValidationResult);

                expect(diffEntry).toEqual({
                    destinationValue: 'new value',
                    printablePath: ['info', 'x-external-id'],
                    scope: 'unclassified',
                    severity: 'unclassified',
                    sourceValue: 'some value',
                    taxonomy: 'unclassified.edit',
                    type: 'edit'
                });
            });

            it('should convert add and warning to unclassified diff entry', () => {
                const warningAddXPropertyValidationResult = validationResultBuilder
                    .withAction('add')
                    .withEntity('oad.unclassified')
                    .withType('warning')
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

                const diffEntry = toDiffEntry(warningAddXPropertyValidationResult);

                expect(diffEntry).toEqual({
                    destinationValue: 'new value',
                    printablePath: ['info', 'x-external-id'],
                    scope: 'unclassified',
                    severity: 'unclassified',
                    sourceValue: undefined,
                    taxonomy: 'unclassified.add',
                    type: 'add'
                });
            });

            it('should convert delete and warning to unclassified diff entry', () => {
                const warningDeleteXPropertyValidationResult = validationResultBuilder
                    .withAction('delete')
                    .withEntity('oad.unclassified')
                    .withType('warning')
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

                const diffEntry = toDiffEntry(warningDeleteXPropertyValidationResult);

                expect(diffEntry).toEqual({
                    destinationValue: undefined,
                    printablePath: ['info', 'x-external-id'],
                    scope: 'unclassified',
                    severity: 'unclassified',
                    sourceValue: 'some value',
                    taxonomy: 'unclassified.delete',
                    type: 'delete'
                });
            });
        });
    });

    describe('openapi', () => {
        it('should convert edit and info to non-breaking diff entry', () => {
            const infoEditVersionValidationResult = validationResultBuilder
                .withAction('edit')
                .withEntity('oad.openapi')
                .withType('info')
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

            const diffEntry = toDiffEntry(infoEditVersionValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: '2.1',
                printablePath: ['swagger'],
                scope: 'openapi',
                severity: 'non-breaking',
                sourceValue: '2.0',
                taxonomy: 'openapi.edit',
                type: 'edit'
            });
        });
    });

    describe('schemes', () => {
        it('should convert item.add and info to non breaking diff entry', () => {
            const infoItemAddSchemeValidationResult = validationResultBuilder
                .withAction('item.add')
                .withEntity('oad.schemes')
                .withType('info')
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

            const diffEntry = toDiffEntry(infoItemAddSchemeValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: 'http',
                printablePath: ['schemes', '0'],
                scope: 'schemes',
                severity: 'non-breaking',
                sourceValue: undefined,
                taxonomy: 'schemes.arrayContent.add',
                type: 'arrayContent.add'
            });
        });

        it('should convert add and error to breaking diff entry', () => {
            const errorAddSchemeValidationResult = validationResultBuilder
                .withAction('add')
                .withEntity('oad.schemes')
                .withType('error')
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

            const diffEntry = toDiffEntry(errorAddSchemeValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: [{originalPath: ['schemes', '0'], value: 'https'}],
                printablePath: ['schemes'],
                scope: 'schemes',
                severity: 'breaking',
                sourceValue: undefined,
                taxonomy: 'schemes.add',
                type: 'add'
            });
        });

        it('should convert item.delete and error to breaking diff entry', () => {
            const errorItemDeleteSchemeValidationResult = validationResultBuilder
                .withAction('item.delete')
                .withEntity('oad.schemes')
                .withType('error')
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

            const diffEntry = toDiffEntry(errorItemDeleteSchemeValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: undefined,
                printablePath: ['schemes', '0'],
                scope: 'schemes',
                severity: 'breaking',
                sourceValue: 'http',
                taxonomy: 'schemes.arrayContent.delete',
                type: 'arrayContent.delete'
            });
        });

        it('should convert delete and error to breaking diff entry', () => {
            const errorDeleteSchemeValidationResult = validationResultBuilder
                .withAction('delete')
                .withEntity('oad.schemes')
                .withType('error')
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

            const diffEntry = toDiffEntry(errorDeleteSchemeValidationResult);

            expect(diffEntry).toEqual({
                destinationValue: undefined,
                printablePath: ['schemes'],
                scope: 'schemes',
                severity: 'breaking',
                sourceValue: [{originalPath: ['schemes', '0'], value: 'https'}],
                taxonomy: 'schemes.delete',
                type: 'delete'
            });
        });
    });
});
