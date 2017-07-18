import * as q from 'q';

import { HttpClient } from '../../../lib/openapi-diff/types';

export default {
    createWithReturnError: (error: NodeJS.ErrnoException): HttpClient => {

        const mockHttpClient = jasmine.createSpyObj('mockHttpClient', ['get']);

        mockHttpClient.get.and.callFake(() => {
            return q.reject(error);
        });

        return mockHttpClient;
    },
    createWithReturnValue: (body: string): HttpClient => {

        const mockHttpClient = jasmine.createSpyObj('mockHttpClient', ['get']);

        mockHttpClient.get.and.callFake(() => {
            return q.resolve(body);
        });

        return mockHttpClient;
    }
};
