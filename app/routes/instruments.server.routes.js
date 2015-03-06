'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var instruments = require('../../app/controllers/instruments.server.controller');

	// Instruments Routes
	app.route('/api/instruments')
		.get(instruments.list)
		.post(users.requiresLogin, instruments.create);

	app.route('/api/instruments/:instrumentId')
		.get(instruments.read)
		.put(users.requiresLogin, instruments.hasAuthorization, instruments.update)
		.delete(users.requiresLogin, instruments.hasAuthorization, instruments.delete);

	// Finish by binding the Instrument middleware
	app.param('instrumentId', instruments.instrumentByID);
};
