'use strict';

const del = require('del');
const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const runSequence = require('run-sequence');

const tsProjectBuildOutput = ts.createProject('tsconfig.json', { noEmit: false });

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
        'clean-build-output',
        'compile-build-output',
        ['lint', 'test'],
        callback
    );
});

gulp.task('lint', () => {
    tsProjectBuildOutput.src()
        .pipe(tslint())
        .pipe(tslint.report());
});

gulp.task('test', () => {
    return gulp.src('build-output/test/**/*[sS]pec.js')
        .pipe(jasmine())
});

gulp.task('watch', ['clean-copy-and-compile-build-output'], () => {
    gulp.watch(['lib/**/*.ts', 'test/**/*.ts'], ['compile-build-output']);
    gulp.watch(['build-output/lib/**/*', 'build-output/test/**/*'], ['test']);
});