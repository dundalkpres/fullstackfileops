/*eslint-env node*/
'use strict';

var _ = require('lodash');
var lintspacesrc = require('./lintspaces');
var spaceindentrc = _.merge({}, lintspacesrc, {
	indentation : 'spaces',
	spaces : 2
});

module.exports = spaceindentrc;
