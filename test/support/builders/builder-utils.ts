interface Builder<T> {
    build(): T;
}

interface Map<T> {
    [key: string]: T;
}

export const buildMapFromBuilders = <T extends Builder<U>, U>(mapOfBuilders: Map<T>): Map<U> => {
    return Object.keys(mapOfBuilders).reduce<Map<U>>((accumulatorMap, key) => {
        accumulatorMap[key] = mapOfBuilders[key].build();
        return accumulatorMap;
    }, {});
};
