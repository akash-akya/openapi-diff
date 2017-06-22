'use strict';

const bump = require('gulp-bump');
const conventionalChangelog = require('gulp-conventional-changelog');
const del = require('del');
const exec = require('child_process').exec;
const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const minimist = require('minimist');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const runSequence = require('run-sequence');

const options = minimist(process.argv.slice(2), {strings: ['type']});

const getBumpType = () => {
    const validTypes = ['major', 'minor', 'patch', 'prerelease'];
    if (validTypes.indexOf(options.type) === -1) {
        throw new Error(
            `You must specify a release type as one of (${validTypes.join(', ')}), e.g. "--type minor"`
        );
    }
    return options.type;
};

const tsProjectBuildOutput = ts.createProject('tsconfig.json', { noEmit: false });

// gulp.task('bump-version', () => {
//     return gulp.src('./package.json')
//         .pipe(bump({type: getBumpType()}))
//         .pipe(gulp.dest('./'))
// });

gulp.task('bump-version', (callback) => {
    return exec(`npm version ${getBumpType()}`, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});

gulp.task('changelog', () => {
    return gulp.src('CHANGELOG.md', {buffer: false})
        .pipe(conventionalChangelog({preset: 'angular'}))
        .pipe(gulp.dest('./'));
});

gulp.task('clean-build-output', () => {
    return del(['build-output/**/*.js']);
});

gulp.task('clean-copy-and-compile-build-output', (callback) => {
    runSequence(
        'clean-build-output',
        'compile-build-output',
        callback
    );
});

gulp.task('compile-build-output', () => {
    const tsResult = tsProjectBuildOutput.src().pipe(tsProjectBuildOutput());
    return tsResult.js.pipe(gulp.dest('build-output'));
});

gulp.task('default', (callback) => {
    runSequence(
        ['clean-copy-and-compile-build-output', 'lint-commits'],
        ['lint-typescript', 'test'],
        callback
    );
});

gulp.task('lint-commits', (callback) => {
    return exec('./node_modules/.bin/conventional-changelog-lint --edit', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});

gulp.task('lint-typescript', () => {
    tsProjectBuildOutput.src()
        .pipe(tslint())
        .pipe(tslint.report());
});

gulp.task('release', (callback) => {
    runSequence(
        'default',
        'bump-version',
        'changelog',
        callback
    );
});

gulp.task('test', () => {
    return gulp.src('build-output/test/**/*[sS]pec.js')
        .pipe(jasmine())
});

gulp.task('watch', ['clean-copy-and-compile-build-output'], () => {
    gulp.watch(['lib/**/*.ts', 'test/**/*.ts'], ['compile-build-output']);
    gulp.watch(['build-output/lib/**/*', 'build-output/test/**/*'], ['test']);
});