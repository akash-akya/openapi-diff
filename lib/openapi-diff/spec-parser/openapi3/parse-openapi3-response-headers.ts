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

const filterOutContentTypeHeader = (responseHeaders: OpenApi3ResponseHeaders): OpenApi3ResponseHeaders => {
    return Object.keys(responseHeaders)
        .filter((header) => header.toLowerCase() !== 'content-type')
        .reduce<OpenApi3ResponseHeaders>((accumulator, key) => {
            accumulator[key] = responseHeaders[key];

            return accumulator;
        }, {});
};

const getHeadersFromResponse = (responseHeaders: OpenApi3ResponseHeaders | undefined): OpenApi3ResponseHeaders => {
    return responseHeaders ? filterOutContentTypeHeader(responseHeaders) : {};
};

export const parseOpenApi3ResponseHeaders = (response: OpenApi3Response, pathBuilder: PathBuilder): ParsedHeaders => {
    const responseHeaders = getHeadersFromResponse(response.headers);
    const parentPathBuilder = pathBuilder.withChild('headers');

    return Object.keys(responseHeaders).reduce<ParsedHeaders>((accumulator, headerName) => {
        const originalPath = parentPathBuilder.withChild(headerName);
        accumulator[headerName] = parseHeader(responseHeaders[headerName], originalPath);

        return accumulator;
    }, {});
};
