'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var instrumentos = require('../../app/controllers/instrumentos.server.controller');

	// Instrumentos Routes
	app.route('/api/instrumentos')
		.get(instrumentos.list)
		.post(users.requiresLogin, instrumentos.create);

	app.route('/api/instrumentos/:instrumentoId')
		.get(instrumentos.read)
		.put(users.requiresLogin, instrumentos.hasAuthorization, instrumentos.update)
		.delete(users.requiresLogin, instrumentos.hasAuthorization, instrumentos.delete);

	// Finish by binding the Instrumento middleware
	app.param('instrumentoId', instrumentos.instrumentoByID);
};
