import {ValidationResultAction, ValidationResultEntity, ValidationResultType} from '../api-types';

interface EntityActionTypeMapEntry {
    entity: ValidationResultEntity;
    action: ValidationResultAction;
    type: ValidationResultType;
}

const entityActionTypeMap: EntityActionTypeMapEntry[] = [
    {entity: 'oad.basePath', action: 'add', type: 'breaking'},
    {entity: 'oad.basePath', action: 'edit', type: 'breaking'},
    {entity: 'oad.basePath', action: 'delete', type: 'breaking'},
    {entity: 'oad.host', action: 'add', type: 'breaking'},
    {entity: 'oad.host', action: 'edit', type: 'breaking'},
    {entity: 'oad.host', action: 'delete', type: 'breaking'},
    {entity: 'oad.info.title', action: 'add', type: 'non-breaking'},
    {entity: 'oad.info.title', action: 'edit', type: 'non-breaking'},
    {entity: 'oad.info.title', action: 'delete', type: 'non-breaking'},
    {entity: 'oad.info.description', action: 'add', type: 'non-breaking'},
    {entity: 'oad.info.description', action: 'edit', type: 'non-breaking'},
    {entity: 'oad.info.description', action: 'delete', type: 'non-breaking'},
    {entity: 'oad.info.termsOfService', action: 'add', type: 'non-breaking'},
    {entity: 'oad.info.termsOfService', action: 'edit', type: 'non-breaking'},
    {entity: 'oad.info.termsOfService', action: 'delete', type: 'non-breaking'},
    {entity: 'oad.info.version', action: 'add', type: 'non-breaking'},
    {entity: 'oad.info.version', action: 'edit', type: 'non-breaking'},
    {entity: 'oad.info.version', action: 'delete', type: 'non-breaking'},
    {entity: 'oad.info.contact.name', action: 'add', type: 'non-breaking'},
    {entity: 'oad.info.contact.name', action: 'edit', type: 'non-breaking'},
    {entity: 'oad.info.contact.name', action: 'delete', type: 'non-breaking'},
    {entity: 'oad.info.contact.email', action: 'add', type: 'non-breaking'},
    {entity: 'oad.info.contact.email', action: 'edit', type: 'non-breaking'},
    {entity: 'oad.info.contact.email', action: 'delete', type: 'non-breaking'},
    {entity: 'oad.info.contact.url', action: 'add', type: 'non-breaking'},
    {entity: 'oad.info.contact.url', action: 'edit', type: 'non-breaking'},
    {entity: 'oad.info.contact.url', action: 'delete', type: 'non-breaking'},
    {entity: 'oad.info.license.name', action: 'add', type: 'non-breaking'},
    {entity: 'oad.info.license.name', action: 'edit', type: 'non-breaking'},
    {entity: 'oad.info.license.name', action: 'delete', type: 'non-breaking'},
    {entity: 'oad.info.license.url', action: 'add', type: 'non-breaking'},
    {entity: 'oad.info.license.url', action: 'edit', type: 'non-breaking'},
    {entity: 'oad.info.license.url', action: 'delete', type: 'non-breaking'},
    {entity: 'oad.schemes', action: 'add', type: 'breaking'},
    {entity: 'oad.schemes', action: 'item.add', type: 'non-breaking'},
    {entity: 'oad.schemes', action: 'item.delete', type: 'breaking'},
    {entity: 'oad.schemes', action: 'edit', type: 'breaking'},
    {entity: 'oad.schemes', action: 'delete', type: 'breaking'},
    {entity: 'oad.unclassified', action: 'add', type: 'unclassified'},
    {entity: 'oad.unclassified', action: 'edit', type: 'unclassified'},
    {entity: 'oad.unclassified', action: 'delete', type: 'unclassified'},
    {entity: 'oad.openapi', action: 'edit', type: 'non-breaking'}

    // 'oad.path' |
    // 'oad.parameter.body' |
    // 'oad.parameter.path' |
    // 'oad.parameter.query' |
    // 'oad.parameter.header' |
    // 'oad.parameter.form' |
    // 'oad.response' |
    // 'oad.response.description' |
    // 'oad.response.header' |
    // 'oad.unclassified.entity'
];

export const resultTypeFinder = {
    lookup: (entity: ValidationResultEntity, action: ValidationResultAction): ValidationResultType => {
        const mapEntry = entityActionTypeMap.find((entry) => entry.entity === entity && entry.action === action);
        if (mapEntry) {
            return mapEntry.type;
        }
        throw new Error(`unclassified change type for: ${action} ${entity}`);
    }
};
