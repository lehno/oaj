'use strict';

// Setting up route
angular.module('sheets').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
        state('listSheets', {
            url: '/partituras',
            templateUrl: 'modules/sheets/views/list-sheets.client.view.html'
        }).
		state('createSheets', {
			url: '/partituras/create',
			templateUrl: 'modules/sheets/views/create-sheets.client.view.html'
		}).
		state('editSheet', {
			url: '/partituras/:sheetId/edit',
			templateUrl: 'modules/sheets/views/edit-sheets.client.view.html'
		});
	}
]);
