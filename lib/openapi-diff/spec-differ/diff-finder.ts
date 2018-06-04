import * as _ from 'lodash';
import {
    Difference,
    DiffResultAction, DiffResultCode,
    DiffResultEntity,
    DiffResultSpecEntityDetails
} from '../../api-types';
import {ParsedProperty, ParsedSpec} from '../types';

interface CreateDifferenceOptions<T> {
    sourceObject?: T;
    destinationObject?: T;
    propertyName: string;
    action: DiffResultAction;
}

interface ParsedSpecs {
    sourceSpec: ParsedSpec;
    destinationSpec: ParsedSpec;
}

export class DiffFinder {
    public static findDifferences(specs: ParsedSpecs): Promise<Difference[]> {

        const basePathDiffs = this.findDiffsInProperty(
            specs.sourceSpec.basePath, specs.destinationSpec.basePath, 'basePath'
        );

        return Promise.resolve(basePathDiffs);

    }

    private static findDiffsInProperty(
        sourceObject: ParsedProperty<string>, destinationObject: ParsedProperty<string>, propertyName: string
    ): Difference[] {

        const additionDiffs = this.findAdditionDiffsInProperty(sourceObject, destinationObject, propertyName);
        const deletionDiffs = this.findDeletionDiffsInProperty(sourceObject, destinationObject, propertyName);
        const editionDiffs = this.findEditionDiffsInProperty(sourceObject, destinationObject, propertyName);

        return _.concat<Difference>([], additionDiffs, deletionDiffs, editionDiffs);
    }

    private static findAdditionDiffsInProperty<T>(
        sourceObject: ParsedProperty<T>, destinationObject: ParsedProperty<T>, propertyName: string
    ): Difference[] {
        const isAddition = this.isUndefinedDeep(sourceObject) && this.isDefinedDeep(destinationObject);

        if (isAddition) {
            return [this.createDifference({sourceObject, destinationObject, propertyName, action: 'add'})];
        }

        return [];
    }

    private static findDeletionDiffsInProperty<T>(
        sourceObject: ParsedProperty<T>, destinationObject: ParsedProperty<T>, propertyName: string
    ): Difference[] {
        const isDeletion = this.isDefinedDeep(sourceObject) && this.isUndefinedDeep(destinationObject);

        if (isDeletion) {
            return [this.createDifference({sourceObject, destinationObject, propertyName, action: 'remove'})];
        }

        return [];
    }

    private static findEditionDiffsInProperty(
        sourceObject: ParsedProperty<string>, destinationObject: ParsedProperty<string>, propertyName: string
    ): Difference[] {
        const isEdition = this.isDefinedDeep(sourceObject)
            && this.isDefinedDeep(destinationObject) && (sourceObject.value !== destinationObject.value);

        if (isEdition) {
            return [
                this.createDifference({sourceObject, destinationObject, propertyName, action: 'add'}),
                this.createDifference({sourceObject, destinationObject, propertyName, action: 'remove'})
            ];
        }

        return [];
    }

    private static createDifference<T>(options: CreateDifferenceOptions<ParsedProperty<T>>): Difference {
        const entity = this.findEntityForDiff(options.propertyName);
        return {
            action: options.action,
            code: `${entity}.${options.action}` as DiffResultCode,
            destinationSpecEntityDetails: this.createSpecEntityDetails(options.destinationObject),
            entity,
            source: 'openapi-diff',
            sourceSpecEntityDetails: this.createSpecEntityDetails(options.sourceObject)
        };
    }

    private static findEntityForDiff(propertyName: string): DiffResultEntity {
        return propertyName.includes('xProperties')
            ? 'unclassified'
            : `${propertyName}` as DiffResultEntity;
    }

    private static createSpecEntityDetails<T>(parsedProperty?: ParsedProperty<T>): DiffResultSpecEntityDetails {
        return parsedProperty
            ? {
                location: parsedProperty.originalPath.join('.'),
                value: parsedProperty.value
            }
            : {
                location: undefined,
                value: undefined
            };
    }

    private static isUndefinedDeep(objectWithValue: { value?: any }): boolean {
        return _.isUndefined(objectWithValue) || _.isUndefined(objectWithValue.value);
    }

    private static isDefinedDeep(objectWithValue: { value?: any }): boolean {
        return this.isDefined(objectWithValue) && this.isDefined(objectWithValue.value);
    }

    private static isDefined(target: any): boolean {
        return !_.isUndefined(target);
    }
}
