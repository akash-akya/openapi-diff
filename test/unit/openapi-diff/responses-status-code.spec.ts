import {breakingDiffResultBuilder, nonBreakingDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openapi3ContentBuilder} from '../../support/builders/openapi3-content-builder';
import {openApi3OperationBuilder} from '../../support/builders/openapi3-operation-builder';
import {openApi3PathItemBuilder} from '../../support/builders/openapi3-path-item-builder';
import {openApi3SpecBuilder} from '../../support/builders/openapi3-spec-builder';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('openapi-diff response-codes', () => {
    it('should return differences, when a response status code did not exist and was added', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath('/some/path', openApi3PathItemBuilder
                .withOperation('post', openApi3OperationBuilder));
        const destinationSpec = openApi3SpecBuilder
            .withPath('/some/path', openApi3PathItemBuilder
                .withOperation('post', openApi3OperationBuilder
                    .withResponse('200', openapi3ContentBuilder)
                    .withResponse('201', openapi3ContentBuilder)));

        const baseNonBreakingAddDiffResultBuilder = nonBreakingDiffResultBuilder
            .withAction('add')
            .withCode('response.status-code.add')
            .withEntity('response.status-code')
            .withSource('openapi-diff')
            .withSourceSpecEntityDetails([]);

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            baseNonBreakingAddDiffResultBuilder
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation('paths./some/path.post.responses.201')
                        .withValue(openapi3ContentBuilder.build())
                ])
                .build(),
            baseNonBreakingAddDiffResultBuilder
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation('paths./some/path.post.responses.200')
                        .withValue(openapi3ContentBuilder.build())
                ])
                .build()
        ]);
    });

    it('should return differences, when a response status code did exist and was removed', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath('/some/path', openApi3PathItemBuilder
                .withOperation('post', openApi3OperationBuilder
                    .withResponse('200', openapi3ContentBuilder)
                    .withResponse('201', openapi3ContentBuilder)));
        const destinationSpec = openApi3SpecBuilder
            .withPath('/some/path', openApi3PathItemBuilder
                .withOperation('post', openApi3OperationBuilder
                    .withResponse('201', openapi3ContentBuilder)));

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            breakingDiffResultBuilder
                .withAction('remove')
                .withCode('response.status-code.remove')
                .withEntity('response.status-code')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation('paths./some/path.post.responses.200')
                        .withValue(openapi3ContentBuilder.build())
                ])
                .withDestinationSpecEntityDetails([])
                .build()
        ]);
    });
});
