import {DiffPathsOptions} from '../../../lib/openapi-diff';
import {specPathOptionBuilder, SpecPathOptionBuilder} from './spec-path-option-builder';

export class DiffPathsOptionsBuilder {
    public static defaultDiffPathsOptionsBuilder(): DiffPathsOptionsBuilder {
        return new DiffPathsOptionsBuilder(
            specPathOptionBuilder.withLocation('default-source.json'),
            specPathOptionBuilder.withLocation('default-destination.json')
        );
    }

    private constructor(
        private readonly sourceSpec: SpecPathOptionBuilder,
        private readonly destinationSpec: SpecPathOptionBuilder) {}

    public withSourceSpec(sourceSpec: SpecPathOptionBuilder): DiffPathsOptionsBuilder {
        return new DiffPathsOptionsBuilder(sourceSpec, this.destinationSpec);
    }

    public withDestinationSpec(destinationSpec: SpecPathOptionBuilder): DiffPathsOptionsBuilder {
        return new DiffPathsOptionsBuilder(this.sourceSpec, destinationSpec);
    }

    public build(): DiffPathsOptions {
        return {
            destinationSpec: this.destinationSpec.build(),
            sourceSpec: this.sourceSpec.build()
        };
    }
}

export const diffPathsOptionsBuilder = DiffPathsOptionsBuilder.defaultDiffPathsOptionsBuilder();
