import {Difference} from '../../../../lib/api-types';
import {DiffFinder} from '../../../../lib/openapi-diff/spec-differ/diff-finder';
import {ParsedSpec} from '../../../../lib/openapi-diff/spec-parser-types';
import {specEntityDetailsBuilder} from '../../../support/builders/diff-result-spec-entity-details-builder';
import {differenceBuilder} from '../../../support/builders/difference-builder';
import {openApi3PathItemBuilder} from '../../../support/builders/openapi-3-path-item-builder';
import {parsedPathItemBuilder} from '../../../support/builders/parsed-path-item-builder';
import {parsedAnyPropertyBuilder} from '../../../support/builders/parsed-property-builder';
import {parsedSpecBuilder} from '../../../support/builders/parsed-spec-builder';

describe('spec-differ/diff-finder/paths', () => {
    const defaultOriginalValue = openApi3PathItemBuilder.build();

    const createSpecWithPaths = (paths: string[]): ParsedSpec => {
        const parsedPathItems = paths.map((path) =>
            parsedPathItemBuilder
                .withPathName(path)
                .withOriginalValue(
                    parsedAnyPropertyBuilder
                        .withOriginalPath(['paths', path])
                        .withValue(defaultOriginalValue)
                ));

        return parsedSpecBuilder
            .withPaths(parsedPathItems)
            .build();
    };

    const createRemovedPathDifference = (path: string): Difference => {
        return differenceBuilder
            .withAction('remove')
            .withCode('path.remove')
            .withEntity('path')
            .withSource('openapi-diff')
            .withSourceSpecEntityDetails(specEntityDetailsBuilder
                .withLocation(`paths.${path}`)
                .withValue(defaultOriginalValue))
            .withDestinationSpecEntityDetails(specEntityDetailsBuilder.withLocation(undefined).withValue(undefined))
            .build();
    };

    const createAddedPathDifference = (path: string): Difference => {
        return differenceBuilder
            .withAction('add')
            .withCode('path.add')
            .withEntity('path')
            .withSource('openapi-diff')
            .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                .withLocation(`paths.${path}`)
                .withValue(defaultOriginalValue))
            .withSourceSpecEntityDetails(specEntityDetailsBuilder.withLocation(undefined).withValue(undefined))
            .build();
    };

    const invokeDiffFinder = (sourceSpec: ParsedSpec, destinationSpec: ParsedSpec): Promise<Difference[]> =>
        DiffFinder.findDifferences({sourceSpec, destinationSpec});

    it('should return no differences, when path items did not change', async () => {
        const aSpec = createSpecWithPaths(['/some/path']);

        const result = await invokeDiffFinder(aSpec, aSpec);

        expect(result).toEqual([]);
    });

    it('should return an add difference, when a new path was added', async () => {
        const addedPath = '/some/path';
        const sourceSpec = createSpecWithPaths([]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result).toEqual([createAddedPathDifference(addedPath)]);
    });

    it('should return a remove difference, when a path was removed', async () => {
        const removedPath = '/some/path';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([]);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result).toEqual([
            createRemovedPathDifference(removedPath)
        ]);
    });

    it('should return an add and remove difference, when a path is changed', async () => {
        const removedPath = '/some/oldPath';
        const addedPath = '/some/newPath';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result.length).toBe(2);
        expect(result).toContain(createAddedPathDifference(addedPath));
        expect(result).toContain(createRemovedPathDifference(removedPath));
    });

    it('should not find any differences if path parameter name changes', async () => {
        const sourceSpec = createSpecWithPaths(['/some/{oldName}']);
        const destinationSpec = createSpecWithPaths(['/some/{newName}']);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result).toEqual([]);
    });

    it('should not detect differences when multiple path parameter names are changed', async () => {
        const sourceSpec = createSpecWithPaths(['/some/{name}/{id}']);
        const destinationSpec = createSpecWithPaths(['/some/{id}/{name}']);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result).toEqual([]);
    });

    it('should detect differences when a duplicated parameter becomes two different parameters', async () => {
        const removedPath = '/some/{id}/{id}';
        const addedPath = '/some/{id}/{name}';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result.length).toBe(2);
        expect(result).toContain(createAddedPathDifference(addedPath));
        expect(result).toContain(createRemovedPathDifference(removedPath));
    });

    it('should detect differences in paths after parameters', async () => {
        const removedPath = '/{id}/a';
        const addedPath = '/{id}/b';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result.length).toBe(2);
        expect(result).toContain(createAddedPathDifference(addedPath));
        expect(result).toContain(createRemovedPathDifference(removedPath));
    });

    it('should detect differences in paths after multiple usages of the same parameter', async () => {
        const removedPath = '/{id}/{id}/a';
        const addedPath = '/{id}/{id}/b';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result.length).toBe(2);
        expect(result).toContain(createAddedPathDifference(addedPath));
        expect(result).toContain(createRemovedPathDifference(removedPath));
    });

    it('should not detect differences in equivalent paths containing brackets', async () => {
        const sourceSpec = createSpecWithPaths(['/{{id}/c/{{id}}/a{{}{id2}']);
        const destinationSpec = createSpecWithPaths(['/{{name}/c/{{name}}/a{{}{name2}']);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result).toEqual([]);
    });

    it('should detect differences in paths containing brackets', async () => {
        const removedPath = '/{id}}/{id2}}';
        const addedPath = '/{name}}/{name}}';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const result = await invokeDiffFinder(sourceSpec, destinationSpec);

        expect(result.length).toBe(2);
        expect(result).toContain(createAddedPathDifference(addedPath));
        expect(result).toContain(createRemovedPathDifference(removedPath));
    });
});
