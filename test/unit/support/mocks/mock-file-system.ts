import {FileSystem} from '../../../../lib/openapi-diff/resource-loader/file-system';

export type MockFileSystem = jasmine.SpyObj<FileSystem> & {
    givenReadFileReturns(result: string): void;
    givenReadFileFailsWith(error: Error): void;
};

export const createMockFileSystem = (): MockFileSystem => {
    const mockFileSystem: MockFileSystem = jasmine.createSpyObj('mockFileSystem', ['readFile']);

    mockFileSystem.givenReadFileReturns = (result: string): void => {
        mockFileSystem.readFile.and.callFake(() => Promise.resolve(result));
    };

    mockFileSystem.givenReadFileFailsWith = (error: Error): void => {
        mockFileSystem.readFile.and.callFake(() => Promise.reject(error));
    };

    return mockFileSystem;
};
