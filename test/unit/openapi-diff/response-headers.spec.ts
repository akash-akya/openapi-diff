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

    const createSpecWithHeaderAndRequiredValue = (headerName: string, requiredValue: boolean): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withHeader(headerName, openApi3ResponseHeaderBuilder
                            .withRequiredValue(requiredValue)))));
    };

    const createSpecWithOptionalHeader = (responseHeaderName: string): OpenApi3SpecBuilder =>
        createSpecWithHeaderAndRequiredValue(responseHeaderName, false);

    const createSpecWithRequiredHeader = (responseHeaderName: string): OpenApi3SpecBuilder =>
        createSpecWithHeaderAndRequiredValue(responseHeaderName, true);

    const createSpecWithNoHeaders = (): OpenApi3SpecBuilder => {
        return openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder)));
    };

    const createAddOptionalHeaderNonBreakingDiffResult = (headerName: string): DiffResult<'non-breaking'> => {
        return nonBreakingDiffResultBuilder
            .withAction('add')
            .withCode('response.optional.header.add')
            .withEntity('response.optional.header')
            .withSource('openapi-diff')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(baseHeadersChangeLocation.concat(`.${headerName}`))
                    .withValue(openApi3ResponseHeaderBuilder
                        .withRequiredValue(false)
                        .build()
                    )
            ])
            .build();
    };

    const createRemoveOptionalHeaderNonBreakingDiffResult = (headerName: string): DiffResult<'non-breaking'> => {
        return nonBreakingDiffResultBuilder
            .withAction('remove')
            .withCode('response.optional.header.remove')
            .withEntity('response.optional.header')
            .withSource('openapi-diff')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(baseHeadersChangeLocation.concat(`.${headerName}`))
                    .withValue(openApi3ResponseHeaderBuilder
                        .withRequiredValue(false)
                        .build()
                    )
            ])
            .withDestinationSpecEntityDetails([])
            .build();
    };

    const createAddRequiredHeaderNonBreakingDiffResult = (headerName: string): DiffResult<'non-breaking'> => {
        return nonBreakingDiffResultBuilder
            .withAction('add')
            .withCode('response.required.header.add')
            .withEntity('response.required.header')
            .withSource('openapi-diff')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(baseHeadersChangeLocation.concat(`.${headerName}`))
                    .withValue(openApi3ResponseHeaderBuilder
                        .withRequiredValue(true)
                        .build()
                    )
            ])
            .build();
    };

    const createRemoveRequiredHeaderBreakingDiffResult = (headerName: string): DiffResult<'breaking'> => {
        return breakingDiffResultBuilder
            .withAction('remove')
            .withCode('response.required.header.remove')
            .withEntity('response.required.header')
            .withSource('openapi-diff')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation(baseHeadersChangeLocation.concat(`.${headerName}`))
                    .withValue(openApi3ResponseHeaderBuilder
                        .withRequiredValue(true)
                        .build()
                    )
            ])
            .withDestinationSpecEntityDetails([])
            .build();
    };

    it('should return no differences, when there are no changes to response headers', async () => {
        const aSpec = createSpecWithOptionalHeader('x-some-header');

        const outcome = await whenSpecsAreDiffed(aSpec, aSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should return no differences, when response headers are the same but with different case', async () => {
        const sourceSpec = createSpecWithOptionalHeader('X-Some-Header');
        const destinationSpec = createSpecWithOptionalHeader('x-sOME-hEADER');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should ignore Content-Type header when diffing', async () => {
        const sourceSpec = createSpecWithNoHeaders();
        const destinationSpec = createSpecWithOptionalHeader('Content-Type');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should find non-breaking changes, when an optional response header was added', async () => {
        const sourceSpec = createSpecWithNoHeaders();
        const destinationSpec = createSpecWithOptionalHeader('x-some-optional-header');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddOptionalHeaderNonBreakingDiffResult('x-some-optional-header')
        ]);
    });

    it('should find non-breaking changes, when an optional response header was removed', async () => {
        const sourceSpec = createSpecWithOptionalHeader('x-some-optional-header');
        const destinationSpec = createSpecWithNoHeaders();

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createRemoveOptionalHeaderNonBreakingDiffResult('x-some-optional-header')
        ]);
    });

    it('should find non-breaking changes, when a required response header was added', async () => {
        const sourceSpec = createSpecWithNoHeaders();
        const destinationSpec = createSpecWithRequiredHeader('x-some-required-header');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddRequiredHeaderNonBreakingDiffResult('x-some-required-header')
        ]);
    });

    it('should find breaking changes, when a required response header was removed', async () => {
        const sourceSpec = createSpecWithRequiredHeader('x-some-required-header');
        const destinationSpec = createSpecWithNoHeaders();

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createRemoveRequiredHeaderBreakingDiffResult('x-some-required-header')
        ]);
    });

    it('should treat the absence of the required property in headers as the default value', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withHeader('x-some-optional-header', openApi3ResponseHeaderBuilder
                            .withNoRequiredValue()))));
        const destinationSpec = createSpecWithNoHeaders();

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            nonBreakingDiffResultBuilder
                .withAction('remove')
                .withCode('response.optional.header.remove')
                .withEntity('response.optional.header')
                .withSource('openapi-diff')
                .withSourceSpecEntityDetails([
                    specEntityDetailsBuilder
                        .withLocation(baseHeadersChangeLocation.concat('.x-some-optional-header'))
                        .withValue(openApi3ResponseHeaderBuilder
                            .withNoRequiredValue()
                            .build()
                        )
                ])
                .withDestinationSpecEntityDetails([])
                .build()
        ]);
    });

    it('should return differences between response headers considering references', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withComponents(openApi3ComponentsBuilder
                .withHeader('headerReference', openApi3ResponseHeaderBuilder
                    .withRequiredValue(true)))
            .withPath(defaultPath, openApi3PathItemBuilder
                .withOperation(defaultMethod, openApi3OperationBuilder
                    .withResponse(defaultStatusCode, openApi3ResponseBuilder
                        .withHeader('x-required-ref-header', openApi3ResponseHeaderBuilder
                            .withRef('#/components/headers/headerReference')))));
        const destinationSpec = createSpecWithOptionalHeader('x-optional-header');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createRemoveRequiredHeaderBreakingDiffResult('x-required-ref-header'),
            createAddOptionalHeaderNonBreakingDiffResult('x-optional-header')
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
                    .withHeader('x-some-optional-header', openApi3ResponseHeaderBuilder
                        .withRequiredValue(false))))
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
            createAddOptionalHeaderNonBreakingDiffResult('x-some-optional-header')
        ]);
    });

    it('should find non-breaking changes when headers change from optional to required', async () => {
        const sourceSpec = createSpecWithOptionalHeader('x-some-header');
        const destinationSpec = createSpecWithRequiredHeader('x-some-header');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createRemoveOptionalHeaderNonBreakingDiffResult('x-some-header'),
            createAddRequiredHeaderNonBreakingDiffResult('x-some-header')
        ]);
    });

    it('should find breaking changes when headers change from required to optional', async () => {
        const sourceSpec = createSpecWithRequiredHeader('x-some-header');
        const destinationSpec = createSpecWithOptionalHeader('x-some-header');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        expect(outcome).toContainDifferences([
            createAddOptionalHeaderNonBreakingDiffResult('x-some-header'),
            createRemoveRequiredHeaderBreakingDiffResult('x-some-header')
        ]);
    });
});
