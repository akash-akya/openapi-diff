import {DiffResultCode, DiffResultType} from '../../api-types';

type CodeToTypeMap = {[code in DiffResultCode]: DiffResultType};

const codeToTypeMap: CodeToTypeMap = {
    'path.add': 'non-breaking',
    'path.remove': 'breaking',
    'unclassified.add': 'unclassified',
    'unclassified.remove': 'unclassified'
};

export const resultTypeFinder = {
    lookup: (code: DiffResultCode): DiffResultType => codeToTypeMap[code]
};
