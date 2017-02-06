/*eslint-env node*/
'use strict';

var Config = require('config');
var rename = require('./lib/rename');
var
//	sourcePath = Config.get('sourcePath'),
	targetPath = Config.get('targetPath');

console.log(targetPath);

rename([targetPath, 'a.txt'].join('/'), [targetPath, 'b.txt'].join('/'))
	.catch(console.error);
