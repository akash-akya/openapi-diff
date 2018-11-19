import {ParsedHeader, ParsedHeaders} from '../../spec-parser-types';
import {Swagger2Headers, Swagger2Response, Swagger2ResponseHeader} from '../../swagger2';
import {PathBuilder} from '../common/path-builder';

const parseHeader = (header: Swagger2ResponseHeader, pathBuilder: PathBuilder): ParsedHeader => {
    return {
        originalValue: {
            originalPath: pathBuilder.build(),
            value: header
        },
        required: {
            originalValue: {
                originalPath: pathBuilder.withChild('required').build()
            },
            value: true
        }
    };
};

const parseHeaders = (headersMap: Swagger2Headers, pathBuilder: PathBuilder): ParsedHeaders => {
    return Object.keys(headersMap).reduce<ParsedHeaders>((accumulator, headerName) => {
        const originalPath = pathBuilder.withChild(headerName);
        accumulator[headerName] = parseHeader(headersMap[headerName], originalPath);

        return accumulator;
    }, {});
};

export const parseSwagger2ResponseHeaders = (response: Swagger2Response, pathBuilder: PathBuilder): ParsedHeaders => {
    const headers = response.headers || {};
    const originalPath = pathBuilder.withChild('headers');

    return parseHeaders(headers, originalPath);
};
