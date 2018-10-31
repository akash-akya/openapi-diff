export const isOpenApi3Content = (specContent: any): boolean => {
    const openApiProperty = specContent.openapi;
    return typeof openApiProperty === 'string' && openApiProperty.indexOf('3.') === 0;
};
