import {FileSystem} from '../../../lib/openapi-diff/types';

export default {
    createWithReturnError: (error: NodeJS.ErrnoException): FileSystem => {

        const mockFileSystem = jasmine.createSpyObj('mockFileSystem', ['readFile']);

        mockFileSystem.readFile.and.callFake(() => {
            return Promise.reject(error);
        });

        return mockFileSystem;
    },
    createWithReturnValue: (fileContents: string): FileSystem => {

        const mockFileSystem = jasmine.createSpyObj('mockFileSystem', ['readFile']);

        mockFileSystem.readFile.and.callFake(() => {
            return Promise.resolve(fileContents);
        });

        return mockFileSystem;
    }
};
