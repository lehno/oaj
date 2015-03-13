'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');

    app.route('/api/download')
        .get(core.getFile);

	app.route('/').get(core.index);
};
