import * as _ from 'lodash';
import {Swagger2BodyParameter} from '../../../lib/openapi-diff/swagger2';

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

    public build(): Swagger2BodyParameter {
        const bodyParameter: Swagger2BodyParameter = {
            in: 'body',
            name: this.state.name
        };
        if (this.state.schema) {
            bodyParameter.schema = _.cloneDeep(this.state.schema);
        }
        return bodyParameter;
    }
}

export const swagger2BodyParameterBuilder = Swagger2BodyParameterBuilder.defaultSwagger2BodyParameterBuilder();
