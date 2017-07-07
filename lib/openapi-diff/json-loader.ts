import {isAbsolute, resolve} from 'path';
import {OpenAPISpec} from './types';

export default {
    load: (filePath: string): OpenAPISpec => {
        let specJson: OpenAPISpec;
        if (isAbsolute(filePath)) {
            specJson = require(filePath);
        } else {
            const currentDir = resolve(process.cwd());
            const absoluteFilePath = `${currentDir}/${filePath}`;
            specJson = require(absoluteFilePath);
        }
        return specJson;
    }
};
