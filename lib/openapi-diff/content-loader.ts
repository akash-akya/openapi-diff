import * as url from 'url';
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
            ? this.httpClient.get(location)
            : this.fileSystem.readFile(location);
    }
}
