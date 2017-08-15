import * as _ from 'lodash';

import { ParsedInfoObject } from '../../../../lib/openapi-diff/types';

export class ParsedSpecInfoBuilder {
    private parsedInfo: ParsedInfoObject;

    constructor(parsedInfo: ParsedInfoObject) {
        this.parsedInfo = parsedInfo;
    }

    public build(): ParsedInfoObject {
        return _.cloneDeep(this.parsedInfo);
    }

    public withTitle(value: string): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedInfo.title = copyOfValue;
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }

    public withVersion(value: string): ParsedSpecInfoBuilder {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedInfo.version = copyOfValue;
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }

    public withXProperty(name: string, value: any) {
        const copyOfParsedInfo = _.cloneDeep(this.parsedInfo);
        const copyOfValue = _.cloneDeep(value);
        copyOfParsedInfo[name] = copyOfValue;
        return new ParsedSpecInfoBuilder(copyOfParsedInfo);
    }
}

const defaultParsedInfo = {
    title: 'spec title',
    version: 'spec version'
};

export const parsedSpecInfoBuilder = new ParsedSpecInfoBuilder(defaultParsedInfo);
