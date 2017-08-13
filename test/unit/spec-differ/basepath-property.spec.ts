import specDiffer from '../../../lib/openapi-diff/spec-differ';
import parsedSpecBuilder from '../support/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is an edition in the basePath property', () => {

        const oldParsedSpec = parsedSpecBuilder.withBasePath('basePath info').build();
        const newParsedSpec = parsedSpecBuilder.withBasePath('NEW basePath info').build();
        const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

        it('should classify the change as a breaking edition in the basePath property', () => {
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'NEW basePath info',
                oldValue: 'basePath info',
                printablePath: ['basePath'],
                scope: 'basePath.property',
                severity: 'breaking',
                taxonomy: 'basePath.property.edit',
                type: 'edit'
            });
        });
    });

    describe('when the basePath property is added in the new spec', () => {
        const oldParsedSpec = parsedSpecBuilder.withNoBasePath().build();
        const newParsedSpec = parsedSpecBuilder.withBasePath('NEW basePath info').build();
        const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

        it('should classify the change as a breaking addition of the basePath property', () => {
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
               newValue: 'NEW basePath info',
               oldValue: undefined,
               printablePath: ['basePath'],
               scope: 'basePath.property',
               severity: 'breaking',
               taxonomy: 'basePath.property.add',
               type: 'add'
           });
        });
    });

    describe('when the basePath property is deleted in the new spec', () => {

        const oldParsedSpec = parsedSpecBuilder.withBasePath('OLD basePath info').build();
        const newParsedSpec = parsedSpecBuilder.withNoBasePath().build();
        const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

        it('should classify the change as a breaking deletion of the basePath property', () => {
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
               newValue: undefined,
               oldValue: 'OLD basePath info',
               printablePath: ['basePath'],
               scope: 'basePath.property',
               severity: 'breaking',
               taxonomy: 'basePath.property.delete',
               type: 'delete'
           });
        });
    });
});
