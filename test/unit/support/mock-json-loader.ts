import * as proxyquire from 'proxyquire';
import { RequestCallback } from 'request';

// tslint:disable:no-unused-expression
export default {
    overrideFsReadFileResponseWith: (err: NodeJS.ErrnoException | null, data: string | null): any => {
        const jsonLoader =
            proxyquire('../../../lib/openapi-diff/json-loader', {fs: {
                readFile: (filename: string,
                           encoding: string,
                           callback: (err: NodeJS.ErrnoException | null,
                                      data: string | null) => void): void => { // TODO: dodgy
                    filename; // TODO: dodgy
                    encoding; // TODO: dodgy
                    callback(err, data);
                }
            }});

        return jsonLoader.default;
    },
    overrideRequestGetResponseWith: (err: any, response: any, body: any): any => {
        const jsonLoader =
            proxyquire('../../../lib/openapi-diff/json-loader', {request: {
                get: (uri: string,
                      callback: RequestCallback): void => {
                    uri; // TODO: dodgy
                    callback(err, response, body);
                }
            }});

        return jsonLoader.default;
    }
};
