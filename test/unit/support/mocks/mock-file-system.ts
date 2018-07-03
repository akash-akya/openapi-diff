import {FileSystem} from '../../../../lib/openapi-diff/resource-loader/file-system';
import {swagger2SpecBuilder} from '../../../support/builders/swagger2-spec-builder';

export type MockFileSystem = jasmine.SpyObj<FileSystem> & {
    givenReadFileReturnsContent(content: string): void;
    givenReadFileReturns(...results: Array<Promise<string>>): void;
    givenReadFileFailsWith(error: Error): void;
};

export const createMockFileSystem = (): MockFileSystem => {
    const mockFileSystem: MockFileSystem = jasmine.createSpyObj('mockFileSystem', ['readFile']);

    mockFileSystem.givenReadFileReturnsContent = (content) => {
        mockFileSystem.readFile.and.callFake(() => Promise.resolve(content));
    };

    mockFileSystem.givenReadFileReturns = (...results) => {
        mockFileSystem.readFile.and.returnValues(...results);
    };

    mockFileSystem.givenReadFileFailsWith = (error) => {
        mockFileSystem.readFile.and.callFake(() => Promise.reject(error));
    };

    mockFileSystem.givenReadFileReturnsContent(JSON.stringify(swagger2SpecBuilder.build()));

    return mockFileSystem;
};
