/*eslint-env node*/
'use strict';

var
	gulp           = require('gulp'),
	istanbul       = require('gulp-istanbul'),
	lintspaces     = require('gulp-lintspaces'),
	eslint         = require('gulp-eslint'),
	mocha          = require('gulp-mocha'),
	_              = require('lodash');

var
	lintspacesrc   = require('./standards/lintspaces'),
	eslintrc       = require('./standards/eslint'),
	spacesindentrc = require('./standards/spaceindent');

var
	topLevelDirs = '{config,lib,standards}',
	config = {
		coverage : {
			statements : 80,
			branches   : 80,
			functions  : 80,
			lines      : 80
		},
		paths: {
			js: [
				'*.js',
				[topLevelDirs, '**/*.js'].join('/')
			],
			test: [
				'*.test.js',
				[topLevelDirs, '**/*.test.js'].join('/')
			],
			whitespace: [
				'*.*',
				[topLevelDirs, '**/*.*'].join('/'),
				'!**/package.json'
			],
			packagejson: [
				'package.json'
			]
		}
	};

function onError(e) {
	throw e;
}

function CheckCoverage() {
	function checkTypeCoverage(v, k) {
		return config.coverage[k] > v.pct;
	}

	var failedCoverage = _.some(istanbul.summarizeCoverage(), checkTypeCoverage);

	if (failedCoverage) {
		this.emit('error', new Error('Inadequate test coverage'));
	}
}

gulp.task('lint:whitespace', function lintWhitespace() {
	return gulp.src(config.paths.whitespace)
		.pipe(lintspaces(lintspacesrc))
		.pipe(lintspaces.reporter())
		.on('error', onError);
});

gulp.task('lint:package', function lintWhitespace() {
	return gulp.src(config.paths.packagejson)
		.pipe(lintspaces(spacesindentrc))
		.pipe(lintspaces.reporter())
		.on('error', onError);
});

gulp.task('lint:js', function lintJS() {
	return gulp.src(config.paths.js)
		.pipe(eslint(eslintrc))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.on('error', onError);
});

gulp.task('mocha', function mochaRun(cb) {
	gulp.src(config.paths.js)
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', function runTests() {
			gulp.src(config.paths.test)
				.pipe(mocha())
				.pipe(istanbul.writeReports())
				.on('end', CheckCoverage)
				.on('end', cb)
				.on('error', onError);
		});
});

gulp.task('lint', ['lint:whitespace', 'lint:package', 'lint:js']);
gulp.task('test', ['lint', 'mocha']);
gulp.task('default', ['test']);
