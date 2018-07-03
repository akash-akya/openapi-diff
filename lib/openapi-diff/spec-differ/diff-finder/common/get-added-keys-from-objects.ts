export const getAddedKeysFromObjects = (source: object, destination: object): string[] => {
    const sourceKeys = Object.keys(source);
    return Object.keys(destination).filter((key) => sourceKeys.indexOf(key) === -1);
};
