import {OpenApiDiff} from './openapi-diff';
import {ContentLoader} from './openapi-diff/content-loader';
import {FileSystem} from './openapi-diff/resource-loader/file-system';
import {HttpClient} from './openapi-diff/resource-loader/http-client';
import {ResultReporter} from './openapi-diff/result-reporter';
import {ConsoleLogger} from './openapi-diff/result-reporter/console-logger';

export class CliFactory {
    public static createOpenApiDiff(): OpenApiDiff {
        const httpClient = new HttpClient();
        const fileSystem = new FileSystem();
        const contentLoader = new ContentLoader(httpClient, fileSystem);
        const consoleLogger = new ConsoleLogger();
        const resultReporter = new ResultReporter(consoleLogger);
        return new OpenApiDiff(contentLoader, resultReporter);
    }
}
