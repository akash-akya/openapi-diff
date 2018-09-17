import {breakingDiffResultBuilder, nonBreakingDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openApi3OperationBuilder} from '../../support/builders/openapi3-operation-builder';
import {openApi3PathItemBuilder} from '../../support/builders/openapi3-path-item-builder';
import {openApi3ResponseBuilder} from '../../support/builders/openapi3-response-builder';
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
                    .withResponse('200', openApi3ResponseBuilder)
                    .withResponse('201', openApi3ResponseBuilder)));

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
                        .withValue(openApi3ResponseBuilder.build())
                ])
                .build(),
            baseNonBreakingAddDiffResultBuilder
                .withDestinationSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation('paths./some/path.post.responses.200')
                        .withValue(openApi3ResponseBuilder.build())
                ])
                .build()
        ]);
    });

    it('should return differences, when a response status code did exist and was removed', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath('/some/path', openApi3PathItemBuilder
                .withOperation('post', openApi3OperationBuilder
                    .withResponse('200', openApi3ResponseBuilder)
                    .withResponse('201', openApi3ResponseBuilder)));
        const destinationSpec = openApi3SpecBuilder
            .withPath('/some/path', openApi3PathItemBuilder
                .withOperation('post', openApi3OperationBuilder
                    .withResponse('201', openApi3ResponseBuilder)));

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
                        .withValue(openApi3ResponseBuilder.build())
                ])
                .withDestinationSpecEntityDetails([])
                .build()
        ]);
    });
});
