import {DiffResult} from '../../../lib/api-types';
import {OpenApi3MethodName} from '../../../lib/openapi-diff/openapi3';
import {breakingDiffResultBuilder, nonBreakingDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openApi3OperationBuilder} from '../../support/builders/openapi3-operation-builder';
import {openApi3PathItemBuilder} from '../../support/builders/openapi3-path-item-builder';
import {OpenApi3SpecBuilder, openApi3SpecBuilder} from '../../support/builders/openapi3-spec-builder';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('openapi-diff methods', () => {
    const defaultPath = '/some/path';
    const defaultOriginalValue = openApi3OperationBuilder.build();

    const createSpecWithMethod = (method: OpenApi3MethodName): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath,
                openApi3PathItemBuilder.withOperation(method, openApi3OperationBuilder));
    };

    const createSpecWithNoMethods = (): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder.withPath(defaultPath, openApi3PathItemBuilder.withNoOperations());
    };

    const createRemovedMethodDiffResult = (method: string): DiffResult<'breaking'> => {
        return breakingDiffResultBuilder
            .withCode('method.remove')
            .withSource('openapi-diff')
            .withEntity('method')
            .withAction('remove')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                .withLocation(`paths.${defaultPath}.${method}`)
                .withValue(defaultOriginalValue)
            ])
            .withDestinationSpecEntityDetails([])
            .build();
    };

    const createAddedMethodDiffResult = (method: string): DiffResult<'non-breaking'> => {
        return nonBreakingDiffResultBuilder
            .withCode('method.add')
            .withSource('openapi-diff')
            .withEntity('method')
            .withAction('add')
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                .withLocation(`paths.${defaultPath}.${method}`)
                .withValue(defaultOriginalValue)
            ])
            .withSourceSpecEntityDetails([])
            .build();
    };

    it('should return no differences for paths with same methods', async () => {
        const sourceSpec = createSpecWithMethod('get');
        const destinationSpec = createSpecWithMethod('get');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should report an add difference, when a new method was added to a path', async () => {
        const sourceSpec = createSpecWithNoMethods();
        const destinationSpec = createSpecWithMethod('get');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddedMethodDiffResult('get')
        ]);
    });

    it('should report a remove difference, when a method was removed from a path', async () => {
        const sourceSpec = createSpecWithMethod('get');
        const destinationSpec = createSpecWithNoMethods();

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createRemovedMethodDiffResult('get')
        ]);
    });

    it('should report a add and remove differences, when a method was changed', async () => {
        const sourceSpec = createSpecWithMethod('get');
        const destinationSpec = createSpecWithMethod('post');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createRemovedMethodDiffResult('get'),
            createAddedMethodDiffResult('post')
        ]);
    });

    it('should not diff non-operation properties in a path', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath('/some/path', openApi3PathItemBuilder
                .withDescription('source spec description')
            );
        const destinationSpec = openApi3SpecBuilder
            .withPath('/some/path', openApi3PathItemBuilder
                .withDescription(undefined)
            );

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([]);
    });
});
