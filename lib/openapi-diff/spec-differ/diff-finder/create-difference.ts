import {
    Difference,
    DiffResultAction,
    DiffResultCode,
    DiffResultEntity,
    DiffResultSpecEntityDetails
} from '../../../api-types';
import {ParsedProperty} from '../../spec-parser-types';

interface CreateDifferenceOptions<T> {
    sourceObject?: T;
    destinationObject?: T;
    propertyName: string;
    action: DiffResultAction;
}

const findEntityForDiff = (propertyName: string): DiffResultEntity => {
    return propertyName.includes('xProperties')
        ? 'unclassified'
        : `${propertyName}` as DiffResultEntity;
};

const createSpecEntityDetails = <T>(parsedProperty?: ParsedProperty<T>): DiffResultSpecEntityDetails => {
    return parsedProperty
        ? {
            location: parsedProperty.originalPath.join('.'),
            value: parsedProperty.value
        }
        : {
            location: undefined,
            value: undefined
        };
};

export const createDifference = <T>(options: CreateDifferenceOptions<ParsedProperty<T>>): Difference => {
    const entity = findEntityForDiff(options.propertyName);
    return {
        action: options.action,
        code: `${entity}.${options.action}` as DiffResultCode,
        destinationSpecEntityDetails: createSpecEntityDetails(options.destinationObject),
        entity,
        source: 'openapi-diff',
        sourceSpecEntityDetails: createSpecEntityDetails(options.sourceObject)
    };
};
