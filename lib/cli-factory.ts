import {OpenApiDiff} from './openapi-diff';
import {FileSystem} from './openapi-diff/resource-loader/file-system';
import {HttpClient} from './openapi-diff/resource-loader/http-client';
import {SpecLoader} from './openapi-diff/spec-loader';

export class CliFactory {
    public static createOpenApiDiff(): OpenApiDiff {
        const httpClient = new HttpClient();
        const fileSystem = new FileSystem();
        const specLoader = new SpecLoader(httpClient, fileSystem);
        return new OpenApiDiff(specLoader);
    }
}
