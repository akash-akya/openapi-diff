import * as request from 'request';
import * as VError from 'verror';

import { HttpClient } from '../types';

const httpClient: HttpClient = {
    get: (location) => {
        return new Promise((resolve, reject) => {
            request.get(location, (error, response, body) => {
                if (error) {
                    reject(new VError(error, `ERROR: unable to open ${location}`));
                } else if (response.statusCode !== 200) {
                    reject(
                        new VError(error, `ERROR: unable to fetch ${location}. Response code: ${response.statusCode}`));
                } else {
                    resolve(body);
                }
            });
        });
    }
};

export default httpClient;
