/*eslint-env node,mocha*/
'use strict';

var
	fs = require('fs'),
	assert = require('assert');

var
	Bluebird = require('bluebird'),
	mock = require('mock-fs');

var renamer = require('./renamer');
var stat = Bluebird.promisify(fs.stat);

describe('getEditedPath', function () {
	it('should return something', function () {
		assert.ok(renamer.getEditedPath('./files/original/file.js'));
	});
	it('should return a properly renamed file path', function () {
		var
			ts = '2015-05-31T14:22:00.000',
			newDir = './files/moved';
		assert.equal(renamer.getEditedPath('./files/original/my-text-file.txt', newDir, ts),
			'./files/moved/my-text-file_EDITED_2015-05-31_14-22.txt');
	});
});

describe('rename', function () {
	before(function () {
		mock({
			files: {
				original: {
					'one.txt': 'file content here'
				},
				moved: {
				}
			}
		});
	});

	it('should rename the file', function () {
		var
			filePath = './files/original/one.txt',
			ts = '2015-05-31T14:22:00.000',
			newDir = './files/moved';
		renamer.rename(filePath, renamer.getEditedPath(filePath, newDir, ts)).then(function () {
			return stat('./files/moved/one_EDITED_2015-05-31_14-22.txt');
		}).then(function (fileStat) {
			assert.ok(fileStat.isFile());
		}).error(function () {
			assert.ok(false);
		});
	});

	after(function () {
		mock.restore();
	});
});
