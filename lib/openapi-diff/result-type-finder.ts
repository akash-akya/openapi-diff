import {ValidationResultAction, ValidationResultEntity, ValidationResultType} from '../api-types';

interface EntityActionTypeMapEntry {
    entity: ValidationResultEntity;
    action: ValidationResultAction;
    type: ValidationResultType;
}

const entityActionTypeMap: EntityActionTypeMapEntry[] = [
    {entity: 'oad.basePath', action: 'add', type: 'error'},
    {entity: 'oad.basePath', action: 'edit', type: 'error'},
    {entity: 'oad.basePath', action: 'delete', type: 'error'},
    {entity: 'oad.host', action: 'add', type: 'error'},
    {entity: 'oad.host', action: 'edit', type: 'error'},
    {entity: 'oad.host', action: 'delete', type: 'error'},
    {entity: 'oad.info.title', action: 'add', type: 'info'},
    {entity: 'oad.info.title', action: 'edit', type: 'info'},
    {entity: 'oad.info.title', action: 'delete', type: 'info'},
    {entity: 'oad.info.description', action: 'add', type: 'info'},
    {entity: 'oad.info.description', action: 'edit', type: 'info'},
    {entity: 'oad.info.description', action: 'delete', type: 'info'},
    {entity: 'oad.info.termsOfService', action: 'add', type: 'info'},
    {entity: 'oad.info.termsOfService', action: 'edit', type: 'info'},
    {entity: 'oad.info.termsOfService', action: 'delete', type: 'info'},
    {entity: 'oad.info.version', action: 'add', type: 'info'},
    {entity: 'oad.info.version', action: 'edit', type: 'info'},
    {entity: 'oad.info.version', action: 'delete', type: 'info'},
    {entity: 'oad.info.contact.name', action: 'add', type: 'info'},
    {entity: 'oad.info.contact.name', action: 'edit', type: 'info'},
    {entity: 'oad.info.contact.name', action: 'delete', type: 'info'},
    {entity: 'oad.info.contact.email', action: 'add', type: 'info'},
    {entity: 'oad.info.contact.email', action: 'edit', type: 'info'},
    {entity: 'oad.info.contact.email', action: 'delete', type: 'info'},
    {entity: 'oad.info.contact.url', action: 'add', type: 'info'},
    {entity: 'oad.info.contact.url', action: 'edit', type: 'info'},
    {entity: 'oad.info.contact.url', action: 'delete', type: 'info'},
    {entity: 'oad.info.license.name', action: 'add', type: 'info'},
    {entity: 'oad.info.license.name', action: 'edit', type: 'info'},
    {entity: 'oad.info.license.name', action: 'delete', type: 'info'},
    {entity: 'oad.info.license.url', action: 'add', type: 'info'},
    {entity: 'oad.info.license.url', action: 'edit', type: 'info'},
    {entity: 'oad.info.license.url', action: 'delete', type: 'info'},
    {entity: 'oad.schemes', action: 'add', type: 'error'},
    {entity: 'oad.schemes', action: 'item.add', type: 'info'},
    {entity: 'oad.schemes', action: 'item.delete', type: 'error'},
    {entity: 'oad.schemes', action: 'edit', type: 'error'},
    {entity: 'oad.schemes', action: 'delete', type: 'error'},
    {entity: 'oad.unclassified', action: 'add', type: 'warning'},
    {entity: 'oad.unclassified', action: 'edit', type: 'warning'},
    {entity: 'oad.unclassified', action: 'delete', type: 'warning'},
    {entity: 'oad.openapi', action: 'edit', type: 'info'}

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
