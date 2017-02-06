/*eslint-env node*/
'use strict';

var
	fs = require('fs'),
	path = require('path');
var
	Bluebird = require('bluebird'),
	moment = require('moment');
var rename = Bluebird.promisify(fs.rename);

function getEditedPath(oldPath, newDir, ts) {
	var
		now = moment(ts),
		dir = newDir || path.dirname(oldPath),
		ext = path.extname(oldPath),
		name = path.basename(oldPath, ext);
	var pathObject = {
		dir: dir,
// TODO : figure out why this doesn't work
//		name: [name, '.haha'].join(''),
//		ext: ext
		base: [name, '_EDITED_', now.format('YYYY-MM-DD_HH-mm'), ext].join('')
	};
	return path.format(pathObject);
}

module.exports = {
	rename: function (oldPath, newPath, ts) {
		return rename(oldPath, newPath || getEditedPath(oldPath, ts));
	},
	getEditedPath: getEditedPath
};
