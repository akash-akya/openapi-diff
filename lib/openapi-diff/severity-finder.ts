import * as _ from 'lodash';

import {
    DiffEntrySeverity,
    DiffEntryTaxonomy
} from './types';

interface DictionaryEntry {
    taxonomy: DiffEntryTaxonomy;
    severity: DiffEntrySeverity;
}

const severityDictionary: DictionaryEntry[] = [
    {taxonomy: 'basePath.add', severity: 'breaking'},
    {taxonomy: 'basePath.delete', severity: 'breaking'},
    {taxonomy: 'basePath.edit', severity: 'breaking'},
    {taxonomy: 'host.add', severity: 'breaking'},
    {taxonomy: 'host.delete', severity: 'breaking'},
    {taxonomy: 'host.edit', severity: 'breaking'},
    {taxonomy: 'info.title.edit', severity: 'non-breaking'},
    {taxonomy: 'info.description.add', severity: 'non-breaking'},
    {taxonomy: 'info.description.delete', severity: 'non-breaking'},
    {taxonomy: 'info.description.edit', severity: 'non-breaking'},
    {taxonomy: 'info.termsOfService.add', severity: 'non-breaking'},
    {taxonomy: 'info.termsOfService.delete', severity: 'non-breaking'},
    {taxonomy: 'info.termsOfService.edit', severity: 'non-breaking'},
    {taxonomy: 'info.version.edit', severity: 'non-breaking'},
    {taxonomy: 'info.contact.name.add', severity: 'non-breaking'},
    {taxonomy: 'info.contact.name.delete', severity: 'non-breaking'},
    {taxonomy: 'info.contact.name.edit', severity: 'non-breaking'},
    {taxonomy: 'info.contact.email.add', severity: 'non-breaking'},
    {taxonomy: 'info.contact.email.delete', severity: 'non-breaking'},
    {taxonomy: 'info.contact.email.edit', severity: 'non-breaking'},
    {taxonomy: 'info.contact.url.add', severity: 'non-breaking'},
    {taxonomy: 'info.contact.url.delete', severity: 'non-breaking'},
    {taxonomy: 'info.contact.url.edit', severity: 'non-breaking'},
    {taxonomy: 'info.license.name.add', severity: 'non-breaking'},
    {taxonomy: 'info.license.name.delete', severity: 'non-breaking'},
    {taxonomy: 'info.license.name.edit', severity: 'non-breaking'},
    {taxonomy: 'info.license.url.add', severity: 'non-breaking'},
    {taxonomy: 'info.license.url.delete', severity: 'non-breaking'},
    {taxonomy: 'info.license.url.edit', severity: 'non-breaking'},
    {taxonomy: 'openapi.edit', severity: 'non-breaking'},
    {taxonomy: 'schemes.add', severity: 'breaking'},
    {taxonomy: 'schemes.arrayContent.add', severity: 'non-breaking'},
    {taxonomy: 'schemes.arrayContent.delete', severity: 'breaking'},
    {taxonomy: 'schemes.edit', severity: 'breaking'},
    {taxonomy: 'schemes.delete', severity: 'breaking'},
    {taxonomy: 'unclassified.add', severity: 'unclassified'},
    {taxonomy: 'unclassified.delete', severity: 'unclassified'},
    {taxonomy: 'unclassified.edit', severity: 'unclassified'}
];

export const severityFinder = {
    lookup: (taxonomy: DiffEntryTaxonomy): DiffEntrySeverity => {
        const correspondingEntry: DictionaryEntry | undefined = _.find(severityDictionary, ['taxonomy', taxonomy]);
        return correspondingEntry ? correspondingEntry.severity : 'unclassified';
    }
};
