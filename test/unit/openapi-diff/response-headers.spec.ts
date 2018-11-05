import {DiffResult} from '../../../lib/api-types';
import {breakingDiffResultBuilder, nonBreakingDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openApi3ComponentsBuilder} from '../../support/builders/openapi3-components-builder';
import {openApi3MediaTypeBuilder} from '../../support/builders/openapi3-media-type-builder';
import {openApi3OperationBuilder} from '../../support/builders/openapi3-operation-builder';
import {openApi3PathItemBuilder} from '../../support/builders/openapi3-path-item-builder';
import {openApi3ResponseBuilder} from '../../support/builders/openapi3-response-builder';
import {openApi3ResponseHeaderBuilder} from '../../support/builders/openapi3-response-header-builder';
import {OpenApi3SpecBuilder, openApi3SpecBuilder} from '../../support/builders/openapi3-spec-builder';
import {refObjectBuilder} from '../../support/builders/ref-object-builder';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('openapi-diff response headers', () => {
    const defaultPath = '/some/path';
    const defaultMethod = 'post';
    const defaultStatusCode = '200';

    const baseHeadersChangeLocation = `paths.${defaultPath}.${defaultMethod}.responses.${defaultStatusCode}.headers`;

    const createSpecWithHeader = (responseHeaderName: string): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withHeader(responseHeaderName, openApi3ResponseHeaderBuilder))));
    };

    const createSpecWithNoHeaders = (): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder)));
    };

    const createAddHeaderDiffResult = (header: string): DiffResult<'non-breaking'> => {
        return nonBreakingDiffResultBuilder
            .withAction('add')
            .withCode('response.header.add')
            .withEntity('response.header')
            .withSource('openapi-diff')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(baseHeadersChangeLocation.concat(`.${header}`))
                    .withValue(openApi3ResponseHeaderBuilder.build())
            ])
            .build();
    };

    const createRemoveHeaderDiffResult = (header: string): DiffResult<'breaking'> => {
        return breakingDiffResultBuilder
            .withAction('remove')
            .withCode('response.header.remove')
            .withEntity('response.header')
            .withSource('openapi-diff')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(baseHeadersChangeLocation.concat(`.${header}`))
                    .withValue(openApi3ResponseHeaderBuilder.build())
            ])
            .withDestinationSpecEntityDetails([])
            .build();
    };

    it('should return no differences, when there are no changes to response headers', async () => {
        const aSpec = createSpecWithHeader('x-some-header');

        const outcome = await whenSpecsAreDiffed(aSpec, aSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should return no differences, when the response headers are the same but with different case', async () => {
        const sourceSpec = createSpecWithHeader('X-Some-Header');
        const destinationSpec = createSpecWithHeader('x-sOME-hEADER');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should ignore Content-Type header when diffing', async () => {
        const sourceSpec = createSpecWithNoHeaders();
        const destinationSpec = createSpecWithHeader('Content-Type');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should return differences, when response headers did not exist and were added', async () => {
        const sourceSpec = createSpecWithNoHeaders();
        const destinationSpec = createSpecWithHeader('x-some-header');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddHeaderDiffResult('x-some-header')
        ]);
    });

    it('should return differences, when response headers did exist and were removed', async () => {
        const sourceSpec = createSpecWithHeader('x-some-header');
        const destinationSpec = createSpecWithNoHeaders();

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createRemoveHeaderDiffResult('x-some-header')
        ]);
    });

    it('should return differences between response headers considering references', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withHeader('headerReference', openApi3ResponseHeaderBuilder))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withHeader('x-some-ref-header', openApi3ResponseHeaderBuilder
                            .withRef('#/components/headers/headerReference')))));
        const destinationSpec = createSpecWithHeader('x-another-header');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createRemoveHeaderDiffResult('x-some-ref-header'),
            createAddHeaderDiffResult('x-another-header')
        ]);
    });

    it('should return differences between headers when response is a reference with inline headers', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder)))
            .withTopLevelXProperty('x-circular-schema', {
                schemaThatPreventsDereferencing: {
                    additionalProperties: {
                        $ref: '#/x-circular-schema/schemaThatPreventsDereferencing'
                    },
                    type: 'object'
                }
            });
        const destinationSpec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withResponse('nonCircularReference', openApi3ResponseBuilder
                    .withMediaType('application/xml', openApi3MediaTypeBuilder
                        .withSchemaRef('#/x-circular-schema/schemaThatPreventsDereferencing'))
                    .withHeader('x-some-header', openApi3ResponseHeaderBuilder)))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, refObjectBuilder
                        .withRef('#/components/responses/nonCircularReference'))))
            .withTopLevelXProperty('x-circular-schema', {
                schemaThatPreventsDereferencing: {
                    additionalProperties: {
                        $ref: '#/x-circular-schema/schemaThatPreventsDereferencing'
                    },
                    type: 'object'
                }
            });

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddHeaderDiffResult('x-some-header')
        ]);
    });
});
