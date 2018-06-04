import {DiffResultCode, DiffResultType} from '../../api-types';

type CodeToTypeMap = {[code in DiffResultCode]: DiffResultType};

const codeToTypeMap: CodeToTypeMap = {
    'basePath.add': 'breaking',
    'basePath.remove': 'breaking',
    'host.add': 'breaking',
    'host.remove': 'breaking',
    'info.contact.email.add': 'non-breaking',
    'info.contact.email.remove': 'non-breaking',
    'info.contact.name.add': 'non-breaking',
    'info.contact.name.remove': 'non-breaking',
    'info.contact.url.add': 'non-breaking',
    'info.contact.url.remove': 'non-breaking',
    'info.description.add': 'non-breaking',
    'info.description.remove': 'non-breaking',
    'info.license.name.add': 'non-breaking',
    'info.license.name.remove': 'non-breaking',
    'info.license.url.add': 'non-breaking',
    'info.license.url.remove': 'non-breaking',
    'info.termsOfService.add': 'non-breaking',
    'info.termsOfService.remove': 'non-breaking',
    'info.title.add': 'non-breaking',
    'info.title.remove': 'non-breaking',
    'info.version.add': 'non-breaking',
    'info.version.remove': 'non-breaking',
    'openapi.add': 'non-breaking',
    'openapi.remove': 'non-breaking',
    'schemes.add': 'breaking',
    'schemes.item.add': 'non-breaking',
    'schemes.item.remove': 'breaking',
    'schemes.remove': 'breaking',
    'unclassified.add': 'unclassified',
    'unclassified.remove': 'unclassified'
};

export const resultTypeFinder = {
    lookup: (code: DiffResultCode): DiffResultType => codeToTypeMap[code]
};
