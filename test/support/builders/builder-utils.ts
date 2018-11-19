import * as _ from 'lodash';

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

export const buildArrayFromBuilders = <T extends Builder<U>, U>(arrayOfBuilders: T[]): U[] => {
    return arrayOfBuilders.map((builder) => builder.build());
};

export const setPropertyIfDefined =
    <T, K extends keyof T>(target: T, propertyKey: K, propertyValue: T[K] | undefined): void => {
        if (propertyValue !== undefined) {
            target[propertyKey] = _.cloneDeep(propertyValue);
        }
    };

export const setPropertyFromBuilderIfDefined =
    <T, K extends keyof T>(target: T, propertyKey: K, propertyValue: Builder<T[K]> | undefined): void => {
        if (propertyValue !== undefined) {
            target[propertyKey] = propertyValue.build();
        }
    };
