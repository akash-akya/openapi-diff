import {ConsoleLogger} from '../../../../lib/openapi-diff/result-reporter/console-logger';

export type MockConsoleLogger = jasmine.SpyObj<ConsoleLogger>;

export const createMockConsoleLogger = (): MockConsoleLogger =>
    jasmine.createSpyObj('mockConsoleLogger', ['error', 'info']);
