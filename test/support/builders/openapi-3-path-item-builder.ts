import * as _ from 'lodash';
import {PathItemObject as OpenApi3PathItem} from 'openapi3-ts';

const defaultOpenApi3PathItem: OpenApi3PathItem = {
    get: {responses: {}}
};

export class OpenApi3PathItemBuilder {
    public static defaultOpenApi3PathItemBuilder(): OpenApi3PathItemBuilder {
        return new OpenApi3PathItemBuilder(defaultOpenApi3PathItem);
    }

    private constructor(private readonly openApi3PathItem: OpenApi3PathItem) {}

    public build(): OpenApi3PathItem {
        return _.cloneDeep(this.openApi3PathItem);
    }
}

export const openApi3PathItemBuilder = OpenApi3PathItemBuilder.defaultOpenApi3PathItemBuilder();
