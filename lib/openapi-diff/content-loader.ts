import * as url from 'url';
import {OpenApiDiffErrorImpl} from '../common/open-api-diff-error-impl';
import {FileSystem} from './resource-loader/file-system';
import {HttpClient} from './resource-loader/http-client';

export class ContentLoader {
    private static isUrl(location: string): boolean {
        const urlObject = url.parse(location);
        return urlObject.protocol !== null;
    }

    public constructor(private readonly httpClient: HttpClient, private readonly fileSystem: FileSystem) {}

    public load(location: string): Promise<string> {
        return ContentLoader.isUrl(location)
            ? this.getContentFromUrl(location)
            : this.getContentFromFile(location);
    }

    private async getContentFromFile(filePath: string): Promise<string> {
        try {
            return await this.fileSystem.readFile(filePath);
        } catch (error) {
            throw new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_READ_ERROR',
                `Unable to read ${filePath}`,
                error
            );
        }
    }

    private async getContentFromUrl(fileUrl: string): Promise<string> {
        try {
            return await this.httpClient.get(fileUrl);
        } catch (error) {
            throw new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_READ_ERROR',
                `Unable to load ${fileUrl}`,
                error
            );
        }
    }
}
