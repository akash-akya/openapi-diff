interface Substitutions {
    [orginalName: string]: string;
}

export const normalizePath = (originalPath: string): string => {
    let normalizedPath = '';
    const substitutions: Substitutions = {};
    const allParamNamesAndPathSegments = originalPath.split('}');

    for (let index = 0; index < allParamNamesAndPathSegments.length; index += 1) {
        const paramNameAndPathSegment = allParamNamesAndPathSegments[index];
        const [pathSegment, paramName] = paramNameAndPathSegment.split('{');

        if (paramName) {
            substitutions[paramName] = substitutions[paramName] || `param${index}`;
            normalizedPath = `${normalizedPath}${pathSegment}{${substitutions[paramName]}}`;
        } else {
            normalizedPath = `${normalizedPath}${pathSegment}`;
        }
    }

    return normalizedPath;
};
