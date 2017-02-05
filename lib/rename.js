/*eslint-env node*/
'use strict';

var fs = require('fs');
var Bluebird = require('bluebird');

module.exports = Bluebird.promisify(fs.rename);
