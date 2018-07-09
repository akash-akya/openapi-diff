interface RefObject {
    $ref: string;
}

interface RefObjectBuilderState {
    ref: string;
}

export class RefObjectBuilder {
    public static defaultRefObjectBuilder(): RefObjectBuilder {
        return new RefObjectBuilder({
            ref: '#/default/reference'
        });
    }

    private constructor(private readonly state: RefObjectBuilderState) {}

    public withRef(ref: string): RefObjectBuilder {
        return new RefObjectBuilder({...this.state, ref});
    }

    public build(): RefObject {
        return {$ref: this.state.ref};
    }
}

export const refObjectBuilder = RefObjectBuilder.defaultRefObjectBuilder();
