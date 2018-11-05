import * as jsonPointer from 'jsonpointer';
import {OpenApiDiffErrorImpl} from '../../../common/open-api-diff-error-impl';

interface SpecReference {
    $ref: string;
}

const toJsonPointer = ($ref: string): string => $ref.substr(1);

const followReference = <T>(reference: SpecReference, spec: object): T | SpecReference => {
    const pointer = toJsonPointer(reference.$ref);

    return jsonPointer.get(spec, pointer);
};

const throwCircularException = (): never => {
    throw new OpenApiDiffErrorImpl(
        'OPENAPI_DIFF_PARSE_ERROR',
        'the spec can not be parsed due to invalid circular references'
    );
};

const hasBeenVisited = (reference: SpecReference, visitedReferences: string[]): boolean => {
    return visitedReferences.indexOf(reference.$ref) !== -1;
};

const getContentFromReference = <T>(reference: SpecReference, spec: object, visitedReferences: string[]): T => {
    const updatedVisitedReferences = [...visitedReferences, reference.$ref];
    const referenceContent = followReference<T>(reference, spec);

    return dereference(referenceContent, spec, updatedVisitedReferences);
};

const attemptDereference = <T>(reference: SpecReference, spec: object, visitedReferences: string[]): T => {
    return hasBeenVisited(reference, visitedReferences)
        ? throwCircularException()
        : getContentFromReference(reference, spec, visitedReferences);
};

const isReference = <T>(object: T | SpecReference): object is SpecReference =>
    typeof (object as SpecReference).$ref === 'string';

const dereference = <T>(objectOrReference: T | SpecReference, spec: object, visitedReferences: string[]): T => {
    return isReference(objectOrReference)
        ? attemptDereference(objectOrReference, spec, visitedReferences)
        : objectOrReference;
};

export const dereferenceObject = <T>(objectOrReference: T | SpecReference, spec: object): T => {
    const initialVisitedReferencesArray: string[] = [];

    return dereference(objectOrReference, spec, initialVisitedReferencesArray);
};
