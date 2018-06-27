import * as _ from 'lodash';
import {ParsedProperty} from '../../../lib/openapi-diff/spec-parser-types';

const defaultParsedPathItem: ParsedProperty<string> = {
    originalPath: ['default-location'],
    value: 'default-value'
};

export class ParsedPropertyBuilder<T> {
    public static defaultParsedStringPropertyBuilder(): ParsedPropertyBuilder<string> {
        return new ParsedPropertyBuilder(defaultParsedPathItem);
    }

    public static defaultParsedAnyPropertyBuilder(): ParsedPropertyBuilder<any> {
        return new ParsedPropertyBuilder(defaultParsedPathItem);
    }

    private constructor(private readonly parsedProperty: ParsedProperty<T>) {}

    public withOriginalPath(paths: string[]): ParsedPropertyBuilder<T> {
        return new ParsedPropertyBuilder({
            originalPath: Array.from(paths),
            value: this.parsedProperty.value
        });
    }

    public withValue(value: T): ParsedPropertyBuilder<T> {
        return new ParsedPropertyBuilder({
            originalPath: this.parsedProperty.originalPath,
            value: _.cloneDeep(value)
        });
    }

    public build(): ParsedProperty<T> {
        return {
            originalPath: Array.from(this.parsedProperty.originalPath),
            value: this.parsedProperty.value
        };
    }
}

export const parsedStringPropertyBuilder = ParsedPropertyBuilder.defaultParsedStringPropertyBuilder();

export const parsedAnyPropertyBuilder = ParsedPropertyBuilder.defaultParsedAnyPropertyBuilder();
