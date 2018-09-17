import {Swagger2Response} from '../../../lib/openapi-diff/swagger2';

interface Swagger2ResponseBuilderState {
    description: string;
}

export class Swagger2ResponseBuilder {
    public static defaultSwagger2ResponseBuilder(): Swagger2ResponseBuilder {
        return new Swagger2ResponseBuilder({
            description: 'default description'
        });
    }

    private constructor(private readonly state: Swagger2ResponseBuilderState) {
    }

    public build(): Swagger2Response {
        return {
            description: this.state.description
        };
    }
}

export const swagger2ResponseBuilder = Swagger2ResponseBuilder.defaultSwagger2ResponseBuilder();
