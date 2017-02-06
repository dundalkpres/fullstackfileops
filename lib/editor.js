/*eslint-env node*/
'use strict';

var fs = require('fs');

var
	_ = require('lodash'),
	Bluebird = require('bluebird');

var Config = require('config');

var
	readFile = Bluebird.promisify(fs.readFile),
	writeFile = Bluebird.promisify(fs.writeFile),
	parse = Bluebird.method(JSON.parse);

var contentToAppend = Config.get('contentToAppend');

function getEditedContent(content, _toAppend) {
	var toAppend = _toAppend || contentToAppend;
	return parse(content)
		.then(function (json) {
			return Bluebird.resolve(JSON.stringify(_.assign({}, json, toAppend.json)));
		})
		.catch(function (error) {
			_.noop(error);
			var contentArray = [content];
			Array.prototype.push.apply(contentArray, toAppend.text);
			return Bluebird.resolve(contentArray.join('\n'));
		});
}

module.exports = {
	getEditedContent: getEditedContent,
	edit: function (filePath, toAppend) {
		return readFile(filePath, 'utf8').then(function (content) {
			return getEditedContent(content, toAppend);
		}).then(function (content) {
			return writeFile(filePath, content, 'utf8');
		});
	}
};
