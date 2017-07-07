export default {
    isXProperty: (propertyPath: string): boolean => {
        return propertyPath.startsWith('x-');
    }
};
