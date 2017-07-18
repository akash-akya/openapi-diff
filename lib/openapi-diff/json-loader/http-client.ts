import * as q from 'q';
import * as request from 'request';
import * as VError from 'verror';

import { HttpClient } from '../types';

const httpClient: HttpClient = {
    get: (location) => {
        const deferred = q.defer<string>();

        request.get(location, (error, response, body) => {
            if (error) {
                deferred.reject(new VError(error, `ERROR: unable to open ${location}`));
            } else if (response.statusCode !== 200) {
                deferred.reject(
                    new VError(error, `ERROR: unable to fetch ${location}. Response code: ${response.statusCode}`));
            } else {
                deferred.resolve(body);
            }
        });

        return deferred.promise;
    }
};

export default httpClient;
