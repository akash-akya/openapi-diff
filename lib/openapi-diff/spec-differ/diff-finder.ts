import {Difference} from '../../api-types';
import {ParsedSpec} from '../spec-parser-types';
import {findDiffsInPaths} from './diff-finder/find-diffs-in-paths';
import {findDiffsInXProperties} from './diff-finder/find-diffs-in-x-properties';

interface ParsedSpecs {
    sourceSpec: ParsedSpec;
    destinationSpec: ParsedSpec;
}

export class DiffFinder {
    public static findDifferences(specs: ParsedSpecs): Promise<Difference[]> {

        const topLevelXPropertiesDiffs = findDiffsInXProperties(
            specs.sourceSpec.xProperties,
            specs.destinationSpec.xProperties,
            'xProperties'
        );
        const pathDiffs = findDiffsInPaths(specs.sourceSpec.paths, specs.destinationSpec.paths);

        const allDiffs = [...topLevelXPropertiesDiffs, ...pathDiffs];

        return Promise.resolve(allDiffs);
    }
}
