import * as assert from 'assert';
import * as _ from 'lodash';
import {
    Swagger2,
    Swagger2BodyParameter,
    Swagger2Paths,
    Swagger2ResponseDefinitions
} from '../../../lib/openapi-diff/swagger2';
import {buildMapFromBuilders} from './builder-utils';
import {Swagger2BodyParameterBuilder} from './swagger2-body-parameter-builder';
import {Swagger2PathItemBuilder} from './swagger2-path-item-builder';
import {Swagger2ResponseBuilder} from './swagger2-response-builder';

interface Swagger2Parameters {
    [parameterName: string]: Swagger2BodyParameter;
}

interface Swagger2SpecBuilderState {
    paths: { [pathName: string]: Swagger2PathItemBuilder };
    definitions: { [definitionsName: string]: any };
    parameters: { [name: string]: Swagger2BodyParameterBuilder };
    responses: { [name: string]: Swagger2ResponseBuilder };
    xProperties: { [key: string]: any };
}

export class Swagger2SpecBuilder {
    public static defaultSwagger2SpecBuilder(): Swagger2SpecBuilder {
        return new Swagger2SpecBuilder({
            definitions: {},
            parameters: {},
            paths: {},
            responses: {},
            xProperties: {}
        });
    }

    private constructor(private readonly state: Swagger2SpecBuilderState) {
    }

    public withTopLevelXProperty(name: string, value: any): Swagger2SpecBuilder {
        assert.ok(name.indexOf('x-') === 0, `Expected name '${name}' to start with x-`);
        const copyOfXproperties = {...this.state.xProperties};
        copyOfXproperties[name] = _.cloneDeep(value);
        return new Swagger2SpecBuilder({...this.state, xProperties: copyOfXproperties});
    }

    public withPath(pathName: string, pathItemBuilder: Swagger2PathItemBuilder): Swagger2SpecBuilder {
        const copyOfPaths = {...this.state.paths};
        copyOfPaths[pathName] = pathItemBuilder;
        return new Swagger2SpecBuilder({...this.state, paths: copyOfPaths});
    }

    public withDefinition(name: string, schema: any): Swagger2SpecBuilder {
        const copyOfDefinitions = {...this.state.definitions};
        copyOfDefinitions[name] = _.cloneDeep(schema);
        return new Swagger2SpecBuilder({...this.state, definitions: copyOfDefinitions});
    }

    public withParameter(name: string, parameter: Swagger2BodyParameterBuilder): Swagger2SpecBuilder {
        const copyOfParameters = {...this.state.parameters};
        copyOfParameters[name] = parameter;
        return new Swagger2SpecBuilder({...this.state, parameters: copyOfParameters});
    }

    public withResponse(name: string, response: Swagger2ResponseBuilder): Swagger2SpecBuilder {
        const copyOfResponses = {...this.state.responses};
        copyOfResponses[name] = response;
        return new Swagger2SpecBuilder({...this.state, responses: copyOfResponses});
    }

    public build(): Swagger2 {
        const definitions = _.cloneDeep(this.state.definitions);
        const paths: Swagger2Paths = buildMapFromBuilders(this.state.paths);
        const parameters: Swagger2Parameters = buildMapFromBuilders(this.state.parameters);
        const responses: Swagger2ResponseDefinitions = buildMapFromBuilders(this.state.responses);
        const xProperties = _.cloneDeep(this.state.xProperties);

        return {
            definitions,
            info: {
                title: '',
                version: ''
            },
            parameters,
            paths,
            responses,
            swagger: '2.0',
            ...xProperties
        };
    }
}

export const swagger2SpecBuilder = Swagger2SpecBuilder.defaultSwagger2SpecBuilder();
