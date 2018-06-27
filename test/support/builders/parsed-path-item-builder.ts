import {ParsedPathItem} from '../../../lib/openapi-diff/spec-parser-types';
import {openApi3PathItemBuilder} from './openapi-3-path-item-builder';
import {parsedAnyPropertyBuilder, ParsedPropertyBuilder} from './parsed-property-builder';

interface ParsedPathItemBuilderState {
    originalValue: ParsedPropertyBuilder<any>;
    pathName: string;
}

const defaultParsedPathItemState: ParsedPathItemBuilderState = {
    originalValue: parsedAnyPropertyBuilder
        .withValue(openApi3PathItemBuilder)
        .withOriginalPath(['default-paths-location', '/default/path']),
    pathName: '/default/path'
};

export class ParsedPathItemBuilder {
    public static defaultParsedPathItemBuilder(): ParsedPathItemBuilder {
        return new ParsedPathItemBuilder(defaultParsedPathItemState);
    }

    private constructor(private readonly state: ParsedPathItemBuilderState) {}

    public withPathName(pathName: string): ParsedPathItemBuilder {
        return new ParsedPathItemBuilder({
            originalValue: this.state.originalValue,
            pathName
        });
    }

    public withOriginalValue(originalValue: ParsedPropertyBuilder<any>): ParsedPathItemBuilder {
        return new ParsedPathItemBuilder({
            originalValue,
            pathName: this.state.pathName
        });
    }

    public build(): ParsedPathItem {
        return {
            originalValue: this.state.originalValue.build(),
            pathName: this.state.pathName
        };
    }
}

export const parsedPathItemBuilder = ParsedPathItemBuilder.defaultParsedPathItemBuilder();
