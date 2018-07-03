export const getRemovedKeysFromObjects = (source: object, destination: object): string[] => {
    const destinationKeys = Object.keys(destination);
    return Object.keys(source).filter((key) => destinationKeys.indexOf(key) === -1);
};
