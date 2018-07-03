import {HttpClient} from '../../../../lib/openapi-diff/resource-loader/http-client';
import {swagger2SpecBuilder} from '../../../support/builders/swagger2-spec-builder';

export type MockHttpClient = jasmine.SpyObj<HttpClient> & {
    givenGetReturns(result: string): void;
    givenGetFailsWith(error: Error): void;
};

export const createMockHttpClient = (): MockHttpClient => {
    const mockHttpClient: MockHttpClient = jasmine.createSpyObj('mockHttpClient', ['get']);

    mockHttpClient.givenGetReturns = (result: string): void => {
        mockHttpClient.get.and.callFake(() => Promise.resolve(result));
    };

    mockHttpClient.givenGetFailsWith = (error: Error): void => {
        mockHttpClient.get.and.callFake(() => Promise.reject(error));
    };

    mockHttpClient.givenGetReturns(JSON.stringify(swagger2SpecBuilder.build()));

    return mockHttpClient;
};
