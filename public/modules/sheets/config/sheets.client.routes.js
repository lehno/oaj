'use strict';

//Setting up route
angular.module('sheets').config(['$stateProvider',
	function($stateProvider) {
		// Sheets state routing
		$stateProvider.
		state('listSheets', {
			url: '/partituras',
			templateUrl: 'modules/sheets/views/list-sheets.client.view.html'
		}).
		state('createSheet', {
			url: '/partituras/adicionar',
			templateUrl: 'modules/sheets/views/create-sheet.client.view.html'
		}).
		state('viewSheet', {
			url: '/partituras/:sheetId',
			templateUrl: 'modules/sheets/views/view-sheet.client.view.html'
		}).
		state('editSheet', {
			url: '/partituras/:sheetId/editar',
			templateUrl: 'modules/sheets/views/edit-sheet.client.view.html'
		});
	}
]);
