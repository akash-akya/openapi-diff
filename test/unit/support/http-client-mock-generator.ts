import * as q from 'q';
import * as VError from 'verror';

import { HttpClient } from '../../../lib/openapi-diff/types';

export default {
    createWithReturnValue: (error: NodeJS.ErrnoException | null,
                            response?: {statusCode: number, body: string | null}): HttpClient => {

        // tslint:disable:cyclomatic-complexity
        const mockHttpClient: HttpClient = {
            get: (location) => {
                const deferred = q.defer<string>();
                if (error) {
                    deferred.reject(new VError(error, `ERROR: unable to open ${location}`));
                } else if (response && response.statusCode !== 200) {
                    deferred.reject(new VError(
                        `ERROR: unable to fetch ${location}. Response code: ${response.statusCode}`));
                } else if (response && response.body) {
                    deferred.resolve(response.body);
                } else {
                    deferred.reject(new VError('The mock Http Client inputs are incorrect'));
                }

                return deferred.promise;
            }
        };

        return mockHttpClient;
    }
};
