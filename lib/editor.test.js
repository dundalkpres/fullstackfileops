/*eslint-env node,mocha*/
'use strict';

var
	assert = require('assert'),
	fs = require('fs');

var
	mock = require('mock-fs'),
	Bluebird = require('bluebird');

var editor = require('./editor');
var readFile = Bluebird.promisify(fs.readFile);

describe('getEditedContent', function () {
	it('should return something', function () {
		assert.ok(editor.getEditedContent('this is content'));
	});
	it('should return an edited json content', function () {
		var json = '{"haha":true,"pizza":{"is":"awesome"}}';
		var append = {
			json : {
				one: 1,
				two: 2
			}
		};
		editor.getEditedContent(json, append).then(function (content) {
			assert.deepEqual(content, '{"haha":true,"pizza":{"is":"awesome"},"one":1,"two":2}');
		});
	});
	it('should return an edited text content', function () {
		var text = 'haha';
		var append = {
			text: ['one', 'two']
		};
		editor.getEditedContent(text, append).then(function (content) {
			assert.equal(content, 'haha\none\ntwo');
		});
	});
});

describe('editor', function () {
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

	it('should write the edited file', function () {
		var filePath = './files/original/one.txt';
		editor.edit(filePath, {
			text: ['one', 'two']
		}).then(function () {
			return readFile(filePath, 'utf8');
		}).then(function (content) {
			assert.equal(content, 'file content here\none\ntwo');
		});
	});

	after(function () {
		mock.restore();
	});
});
