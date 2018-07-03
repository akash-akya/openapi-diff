import {DiffResult} from '../../../lib/api-types';
import {breakingDiffResultBuilder, nonBreakingDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openApi3PathItemBuilder} from '../../support/builders/openapi3-path-item-builder';
import {OpenApi3SpecBuilder, openApi3SpecBuilder} from '../../support/builders/openapi3-spec-builder';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('openapi-diff paths', () => {
    const defaultOriginalValue = openApi3PathItemBuilder.build();

    const createSpecWithPaths = (paths: string[]): OpenApi3SpecBuilder => {
        let spec = openApi3SpecBuilder;

        paths.forEach((path) => {
            spec = spec.withPath(path, openApi3PathItemBuilder);
        });

        return spec;
    };

    const createRemovedPathDiffResult = (path: string): DiffResult<'breaking'> => {
        return breakingDiffResultBuilder
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

    const createAddedPathDiffResult = (path: string): DiffResult<'non-breaking'> => {
        return nonBreakingDiffResultBuilder
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

    it('should return no differences, when path items did not change', async () => {
        const aSpec = createSpecWithPaths(['/some/path']);

        const outcome = await whenSpecsAreDiffed(aSpec, aSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should return an add difference, when a new path was added', async () => {
        const addedPath = '/some/path';
        const sourceSpec = createSpecWithPaths([]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([createAddedPathDiffResult(addedPath)]);
    });

    it('should return a remove difference, when a path was removed', async () => {
        const removedPath = '/some/path';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([]);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createRemovedPathDiffResult(removedPath)
        ]);
    });

    it('should return an add and remove difference, when a path is changed', async () => {
        const removedPath = '/some/oldPath';
        const addedPath = '/some/newPath';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddedPathDiffResult(addedPath),
            createRemovedPathDiffResult(removedPath)
        ]);
    });

    it('should not find any differences if path parameter name changes', async () => {
        const sourceSpec = createSpecWithPaths(['/some/{oldName}']);
        const destinationSpec = createSpecWithPaths(['/some/{newName}']);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should not detect differences when multiple path parameter names are changed', async () => {
        const sourceSpec = createSpecWithPaths(['/some/{name}/{id}']);
        const destinationSpec = createSpecWithPaths(['/some/{id}/{name}']);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should detect differences when a duplicated parameter becomes two different parameters', async () => {
        const removedPath = '/some/{id}/{id}';
        const addedPath = '/some/{id}/{name}';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddedPathDiffResult(addedPath),
            createRemovedPathDiffResult(removedPath)
        ]);
    });

    it('should detect differences in paths after parameters', async () => {
        const removedPath = '/{id}/a';
        const addedPath = '/{id}/b';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddedPathDiffResult(addedPath),
            createRemovedPathDiffResult(removedPath)
        ]);
    });

    it('should detect differences in paths after multiple usages of the same parameter', async () => {
        const removedPath = '/{id}/{id}/a';
        const addedPath = '/{id}/{id}/b';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddedPathDiffResult(addedPath),
            createRemovedPathDiffResult(removedPath)
        ]);
    });

    it('should not detect differences in equivalent paths containing brackets', async () => {
        const sourceSpec = createSpecWithPaths(['/{{id}/c/{{id}}/a{{}{id2}']);
        const destinationSpec = createSpecWithPaths(['/{{name}/c/{{name}}/a{{}{name2}']);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should detect differences in paths containing brackets', async () => {
        const removedPath = '/{id}}/{id2}}';
        const addedPath = '/{name}}/{name}}';

        const sourceSpec = createSpecWithPaths([removedPath]);
        const destinationSpec = createSpecWithPaths([addedPath]);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddedPathDiffResult(addedPath),
            createRemovedPathDiffResult(removedPath)
        ]);
    });
});
