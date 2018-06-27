import * as _ from 'lodash';
import {Swagger2PathItem} from '../../../lib/openapi-diff/swagger2';

const defaultSwagger2PathItem: Swagger2PathItem = {
    get: {
        responses: {
            200: {
                description: 'foo'
            }
        }
    }
};

export class Swagger2PathItemBuilder {
    public static defaultSwagger2PathItemBuilder(): Swagger2PathItemBuilder {
        return new Swagger2PathItemBuilder(defaultSwagger2PathItem);
    }

    private constructor(private readonly openApi3PathItem: Swagger2PathItem) {}

    public build(): Swagger2PathItem {
        return _.cloneDeep(this.openApi3PathItem);
    }
}

export const swagger2PathItemBuilder = Swagger2PathItemBuilder.defaultSwagger2PathItemBuilder();
