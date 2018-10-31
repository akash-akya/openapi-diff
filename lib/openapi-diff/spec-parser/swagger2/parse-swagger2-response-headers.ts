import {ParsedHeader, ParsedHeaders} from '../../spec-parser-types';
import {Swagger2Response, Swagger2ResponseHeader} from '../../swagger2';
import {PathBuilder} from '../common/path-builder';

const parseHeader = (header: Swagger2ResponseHeader, pathBuilder: PathBuilder): ParsedHeader => {
    return {
        originalValue: {
            originalPath: pathBuilder.build(),
            value: header
        }
    };
};

export const parseSwagger2ResponseHeaders = (response: Swagger2Response, pathBuilder: PathBuilder): ParsedHeaders => {
    const responseHeaders = response.headers;
    const parentPathBuilder = pathBuilder.withChild('headers');

    return responseHeaders
        ? Object.keys(responseHeaders).reduce<ParsedHeaders>((accumulator, header) => {
            accumulator[header] = parseHeader(responseHeaders[header], parentPathBuilder.withChild(header));

            return accumulator;
        }, {})
        : {};
};
