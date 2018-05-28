import {ValidationResult, ValidationResultAction, ValidationResultType} from '../../api-types';
import {DiffEntry, DiffEntrySeverity, DiffEntryType} from '../types';

export const toDiffEntry = (validationResult: ValidationResult): DiffEntry => {
    const type = actionToTypeMap[validationResult.action];
    return {
        destinationValue: validationResult.destinationSpecEntityDetails.value,
        printablePath: getPrintablePath(
            validationResult.sourceSpecEntityDetails.location,
            validationResult.destinationSpecEntityDetails.location),
        severity: typeToSeverityMap[validationResult.type],
        sourceValue: validationResult.sourceSpecEntityDetails.value,
        type
    };
};

const getPrintablePath = (sourceLocation?: string, destinationLocation?: string): string [] => {
    const location: string = sourceLocation || destinationLocation || '';
    return location.split('.');
};

const actionToTypeMap: {[action in ValidationResultAction]: DiffEntryType} = {
    'add': 'add',
    'delete': 'delete',
    'edit': 'edit',
    'item.add': 'arrayContent.add',
    'item.delete': 'arrayContent.delete'
};

const typeToSeverityMap: {[type in ValidationResultType]: DiffEntrySeverity} = {
    error: 'breaking',
    info: 'non-breaking',
    warning: 'unclassified'
};
