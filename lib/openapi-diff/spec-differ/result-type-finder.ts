import {DiffResultCode, DiffResultType} from '../../api-types';

type CodeToTypeMap = {[code in DiffResultCode]: DiffResultType};

const codeToTypeMap: CodeToTypeMap = {
    'method.add': 'non-breaking',
    'method.remove': 'breaking',
    'path.add': 'non-breaking',
    'path.remove': 'breaking',
    'request.body.scope.add': 'non-breaking',
    'request.body.scope.remove': 'breaking',
    'response.body.scope.add': 'breaking',
    'response.body.scope.remove': 'non-breaking',
    'response.optional.header.add': 'non-breaking',
    'response.optional.header.remove': 'non-breaking',
    'response.required.header.add': 'non-breaking',
    'response.required.header.remove': 'breaking',
    'response.status-code.add': 'non-breaking',
    'response.status-code.remove': 'breaking',
    'unclassified.add': 'unclassified',
    'unclassified.remove': 'unclassified'
};

export const resultTypeFinder = {
    lookup: (code: DiffResultCode): DiffResultType => codeToTypeMap[code]
};
