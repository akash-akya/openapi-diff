import * as assert from 'assert';
import * as _ from 'lodash';
import {OpenApi3, OpenApi3Paths} from '../../../lib/openapi-diff/openapi3';
import {buildMapFromBuilders} from './builder-utils';
import {OpenApi3ComponentsBuilder, openApi3ComponentsBuilder} from './openapi3-components-builder';
import {OpenApi3PathItemBuilder} from './openapi3-path-item-builder';

interface Openapi3SpecBuilderState {
    paths: { [pathName: string]: OpenApi3PathItemBuilder };
    components: OpenApi3ComponentsBuilder;
    xProperties: { [key: string]: any };
}

export class OpenApi3SpecBuilder {
    public static defaultOpenApi3SpecBuilder(): OpenApi3SpecBuilder {
        return new OpenApi3SpecBuilder({paths: {}, components: openApi3ComponentsBuilder, xProperties: {}});
    }
    private constructor(private readonly state: Openapi3SpecBuilderState) {}
    public withTopLevelXProperty(name: string, value: any): OpenApi3SpecBuilder {
        assert.ok(name.indexOf('x-') === 0, `Expected name '${name}' to start with x-`);
        const copyOfXproperties = {...this.state.xProperties};
        copyOfXproperties[name] = _.cloneDeep(value);
        return new OpenApi3SpecBuilder({...this.state, xProperties: copyOfXproperties});
    }

    public withNoTopLevelXProperties(): OpenApi3SpecBuilder {
        return new OpenApi3SpecBuilder({...this.state, xProperties: {}});
    }

    public withPath(pathName: string, pathItem: OpenApi3PathItemBuilder): OpenApi3SpecBuilder {
        const copyOfPaths = {...this.state.paths};
        copyOfPaths[pathName] = pathItem;
        return new OpenApi3SpecBuilder({...this.state, paths: copyOfPaths});
    }

    public withComponents(components: OpenApi3ComponentsBuilder): OpenApi3SpecBuilder {
        return new OpenApi3SpecBuilder({...this.state, components});
    }

    public withNoPaths(): OpenApi3SpecBuilder {
        return new OpenApi3SpecBuilder({...this.state, paths: {}});
    }

    public build(): OpenApi3 {
        const paths: OpenApi3Paths = buildMapFromBuilders(this.state.paths);
        const xProperties = _.cloneDeep(this.state.xProperties);

        return {
            components: this.state.components.build(),
            info: {
                title: 'spec title',
                version: 'spec version'
            },
            openapi: '3.0.0',
            paths,
            ...xProperties
        };
    }
}

export const openApi3SpecBuilder = OpenApi3SpecBuilder.defaultOpenApi3SpecBuilder();
