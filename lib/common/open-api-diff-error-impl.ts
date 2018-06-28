import * as VError from 'verror';
import {ErrorCode, OpenApiDiffError} from '../api-types';

export class OpenApiDiffErrorImpl extends VError implements OpenApiDiffError {
    public readonly code: ErrorCode;

    public constructor(code: ErrorCode, message: string, cause?: Error) {
        super({cause}, '%s', message);
        this.code = code;
    }

    public toString() {
        return `OpenApiDiffError: { code: ${this.code}, message: ${this.message} }`;
    }
}
