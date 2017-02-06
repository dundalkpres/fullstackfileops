/*eslint-env node*/
'use strict';

var
	fs = require('fs'),
	path = require('path');

var
	Config = require('config'),
	Bluebird = require('bluebird');

var
	renamer = require('./lib/renamer'),
	editor = require('./lib/editor');

var readdir = Bluebird.promisify(fs.readdir);

var
	sourcePath = Config.get('sourcePath'),
	targetPath = Config.get('targetPath');

var
	successes = [],
	failures = [];

readdir(sourcePath)
.catch(console.error)
.then(function (files) {
	return Bluebird.map(files, function (file) {
		var filePath = path.join(sourcePath, file);
		return editor.edit(filePath)
			.then(function () {
				return renamer.rename(filePath, targetPath);
			})
			.then(function () {
				successes.push(filePath);
			})
			.catch(function (error) {
				console.error(error);
				failures.push(filePath);
			});
	}, {concurrency: 3});
})
.then(function () {
	console.log([
		'renamed',
		successes.length,
		'files, with',
		failures.length,
		'errors',
		JSON.stringify(failures)
	].join(' '));
});
