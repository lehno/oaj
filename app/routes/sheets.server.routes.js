'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sheets = require('../../app/controllers/sheets.server.controller');

	// Sheets Routes
	app.route('/api/sheets')
		.get(sheets.list)
		.post(users.requiresLogin, sheets.create);

	app.route('/api/sheets/:sheetId')
		.get(sheets.read)
		.put(users.requiresLogin, sheets.hasAuthorization, sheets.update)
		.delete(users.requiresLogin, sheets.hasAuthorization, sheets.delete);

	// Finish by binding the Sheet middleware
	app.param('sheetId', sheets.sheetByID);
};
