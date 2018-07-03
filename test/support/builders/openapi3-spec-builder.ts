import * as assert from 'assert';
import * as _ from 'lodash';
import {OpenApi3, OpenApi3Paths} from '../../../lib/openapi-diff/openapi3';
import {OpenApi3PathItemBuilder} from './openapi3-path-item-builder';

interface Paths {
    [pathName: string]: OpenApi3PathItemBuilder;
}

interface Openapi3SpecBuilderState {
    paths: Paths;
    xProperties: {[key: string]: any};
}

export class OpenApi3SpecBuilder {
    public static defaultOpenApi3SpecBuilder(): OpenApi3SpecBuilder {
        return new OpenApi3SpecBuilder({paths: {}, xProperties: {}});
    }
    private constructor(private readonly state: Openapi3SpecBuilderState) {}

    public build(): OpenApi3 {
        const paths = Object.keys(this.state.paths).reduce<OpenApi3Paths>((openApi3Paths, currentPath) => {
            openApi3Paths[currentPath] = this.state.paths[currentPath].build();
            return openApi3Paths;
        }, {});
        const copyOfXProperties = _.cloneDeep(this.state.xProperties);

        return {
            info: {
                title: 'spec title',
                version: 'spec version'
            },
            openapi: '3.0.0',
            paths,
            ...copyOfXProperties
        };
    }

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
}

export const openApi3SpecBuilder = OpenApi3SpecBuilder.defaultOpenApi3SpecBuilder();
