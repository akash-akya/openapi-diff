import {OpenApi3Response, OpenApi3ResponseHeader, OpenApi3ResponseHeaders} from '../../openapi3';
import {ParsedHeader, ParsedHeaders} from '../../spec-parser-types';
import {PathBuilder} from '../common/path-builder';

const parseHeader = (header: OpenApi3ResponseHeader, pathBuilder: PathBuilder): ParsedHeader => {
    return {
        originalValue: {
            originalPath: pathBuilder.build(),
            value: header
        }
    };
};

const isSupportedHeader = (headerName: string): boolean => headerName.toLowerCase() !== 'content-type';

const parseHeaders = (headersMap: OpenApi3ResponseHeaders, pathBuilder: PathBuilder): ParsedHeaders => {
    return Object.keys(headersMap)
        .filter(isSupportedHeader)
        .reduce<ParsedHeaders>((accumulator, headerName) => {
            const originalPath = pathBuilder.withChild(headerName);
            accumulator[headerName] = parseHeader(headersMap[headerName], originalPath);

            return accumulator;
        }, {});
};

export const parseOpenApi3ResponseHeaders = (response: OpenApi3Response, pathBuilder: PathBuilder): ParsedHeaders => {
    const headers = response.headers || {};
    const originalPath = pathBuilder.withChild('headers');

    return parseHeaders(headers, originalPath);
};
