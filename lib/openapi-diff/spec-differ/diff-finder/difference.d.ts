import {
    DiffResultAction,
    DiffResultCode,
    DiffResultEntity,
    DiffResultSource,
    DiffResultSpecEntityDetails
} from '../../../api-types';

interface Difference {
    action: DiffResultAction;
    code: DiffResultCode;
    entity: DiffResultEntity;
    sourceSpecEntityDetails: DiffResultSpecEntityDetails;
    destinationSpecEntityDetails: DiffResultSpecEntityDetails;
    source: DiffResultSource;
    details?: any;
}
