import { HttpClient } from '../../../../lib/openapi-diff/types';

export default {
    createWithReturnError: (error: NodeJS.ErrnoException): HttpClient => {

        const mockHttpClient = jasmine.createSpyObj('mockHttpClient', ['get']);

        mockHttpClient.get.and.callFake(() => {
            return Promise.reject(error);
        });

        return mockHttpClient;
    },
    createWithReturnValue: (body: string): HttpClient => {

        const mockHttpClient = jasmine.createSpyObj('mockHttpClient', ['get']);

        mockHttpClient.get.and.callFake(() => {
            return Promise.resolve(body);
        });

        return mockHttpClient;
    }
};
