import {ResultReporter} from '../../../../lib/openapi-diff/result-reporter';

export type MockResultReporter = jasmine.SpyObj<ResultReporter>;

export const createMockResultReporter = (): MockResultReporter =>
    jasmine.createSpyObj('mockResultReporter', ['reportError', 'reportOutcome']);
