import * as _ from 'lodash';
// tslint:disable-next-line:no-implicit-dependencies
import {BodyParameter} from 'swagger-schema-official';
import {isDefined} from './builder-utils';

interface Swagger2BodyParameterBuilderState {
    name: string;
    schema?: any;
}

export class Swagger2BodyParameterBuilder {
    public static defaultSwagger2BodyParameterBuilder(): Swagger2BodyParameterBuilder {
        return new Swagger2BodyParameterBuilder({
            name: 'default-name'
        });
    }

    private constructor(private readonly state: Swagger2BodyParameterBuilderState) {}

    public withName(name: string): Swagger2BodyParameterBuilder {
        return new Swagger2BodyParameterBuilder({...this.state, name});
    }

    public withSchema(schema: any): Swagger2BodyParameterBuilder {
        const copyOfSchema = _.cloneDeep(schema);
        return new Swagger2BodyParameterBuilder({...this.state, schema: copyOfSchema});
    }

    public build(): BodyParameter {
        const bodyParameter: BodyParameter = {
            in: 'body',
            name: this.state.name
        };
        if (isDefined(this.state.schema)) {
            bodyParameter.schema = _.cloneDeep(this.state.schema);
        }
        return bodyParameter;
    }
}

export const swagger2BodyParameterBuilder = Swagger2BodyParameterBuilder.defaultSwagger2BodyParameterBuilder();
