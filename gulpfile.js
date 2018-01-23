'use strict';

const conventionalChangelog = require('gulp-conventional-changelog');
const del = require('del');
const exec = require('child_process').exec;
const fs = require('fs');
const git = require('gulp-git');
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

const getPackageJsonVersion = () => {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

const tsProjectBuildOutput = ts.createProject('tsconfig.json', {noEmit: false});

gulp.task('bump-version', (callback) => {
    return exec(`npm version ${getBumpType()} --no-git-tag-version`, (err, stdout, stderr) => {
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
        ['copy-build-output-package-json', 'compile-build-output'],
        callback
    );
});

gulp.task('clean-copy-and-compile-dist', (callback) => {
    runSequence(
        'clean-dist',
        'compile-dist',
        callback
    );
});

gulp.task('clean-dist', () => {
    return del(['dist/*']);
});

gulp.task('commit-changes', () => {
    return gulp.src('.')
        .pipe(git.add())
        .pipe(git.commit(`chore: release ${getPackageJsonVersion()}`));
});

gulp.task('compile-build-output', () => {
    const tsResult = tsProjectBuildOutput.src().pipe(tsProjectBuildOutput());
    return tsResult.js.pipe(gulp.dest('build-output'));
});

gulp.task('compile-dist', () => {
    const tsProjectDist = ts.createProject('tsconfig.json', {noEmit: false});
    const tsResult = gulp.src('lib/**/*.ts').pipe(tsProjectDist());
    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('copy-build-output-package-json', () => {
    return gulp.src('package.json').pipe(gulp.dest('build-output'))
});

gulp.task('create-new-tag', (callback) => {
    const version = getPackageJsonVersion();
    git.tag(version, `Created Tag for version: ${version}`, callback);
});

gulp.task('default', (callback) => {
    runSequence(
        ['clean-copy-and-compile-build-output', 'lint-commits'],
        ['lint-typescript', 'test'],
        callback
    );
});

gulp.task('e2e-test', () => {
    return gulp.src('build-output/test/e2e/**/*.spec.js')
        .pipe(jasmine())
});

gulp.task('lint-commits', (callback) => {
    return exec('./node_modules/.bin/conventional-changelog-lint --from=HEAD~20 --preset angular',
        (err, stdout, stderr) => {
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

gulp.task('push-changes', (callback) => {
    git.push('origin', 'master', {args: '--tags'}, callback);
});

gulp.task('release', (callback) => {
    runSequence(
        'default',
        'clean-copy-and-compile-dist',
        'bump-version',
        'changelog',
        'commit-changes',
        'create-new-tag',
        'push-changes',
        callback
    );
});

gulp.task('test', () => {
    return gulp.src('build-output/test/**/*[sS]pec.js')
        .pipe(jasmine())
});

gulp.task('unit-test', () => {
    return gulp.src('build-output/test/unit/**/*[sS]pec.js')
        .pipe(jasmine())
});

gulp.task('watch', ['clean-copy-and-compile-build-output'], () => {
    gulp.watch(['lib/**/*.ts', 'test/**/*.ts'], ['compile-build-output']);
    gulp.watch(['build-output/lib/**/*', 'build-output/test/unit/**/*'], ['unit-test']);
});

gulp.task('watch-e2e', ['clean-copy-and-compile-build-output'], () => {
    gulp.watch(['build-output/lib/**/*', 'build-output/test/e2e/**/*', 'test/e2e/**/*.json'], ['e2e-test']);
});