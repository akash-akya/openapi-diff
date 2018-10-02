import * as assert from 'assert';
import * as _ from 'lodash';
import {
    Swagger2,
    Swagger2BodyParameter,
    Swagger2PathItem,
    Swagger2Paths, Swagger2Response,
    Swagger2Responses
} from '../../../lib/openapi-diff/swagger2';
import {buildMapFromBuilders} from './builder-utils';
import {Swagger2BodyParameterBuilder} from './swagger2-body-parameter-builder';
import {Swagger2PathItemBuilder} from './swagger2-path-item-builder';
import {Swagger2ResponseBuilder} from './swagger2-response-builder';

interface Paths {
    [pathName: string]: Swagger2PathItemBuilder;
}

interface Swagger2Parameters {
    [parameterName: string]: Swagger2BodyParameter;
}

interface Swagger2SpecBuilderState {
    paths: Paths;
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

    public withNoPaths(): Swagger2SpecBuilder {
        return new Swagger2SpecBuilder({...this.state, paths: {}});
    }

    public build(): Swagger2 {
        const paths: Swagger2Paths = buildMapFromBuilders<Swagger2PathItemBuilder, Swagger2PathItem>(this.state.paths);
        const parameters: Swagger2Parameters
            = buildMapFromBuilders<Swagger2BodyParameterBuilder, Swagger2BodyParameter>(this.state.parameters);
        const responses: Swagger2Responses
            = buildMapFromBuilders<Swagger2ResponseBuilder, Swagger2Response>(this.state.responses);
        const copyOfXProperties = _.cloneDeep(this.state.xProperties);

        return {
            definitions: _.cloneDeep(this.state.definitions),
            info: {
                title: '',
                version: ''
            },
            parameters,
            paths,
            responses,
            swagger: '2.0',
            ...copyOfXProperties
        };
    }
}

export const swagger2SpecBuilder = Swagger2SpecBuilder.defaultSwagger2SpecBuilder();
