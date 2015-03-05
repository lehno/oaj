'use strict';

//Setting up route
angular.module('instrumentos').config(['$stateProvider',
	function($stateProvider) {
		// Instrumentos state routing
		$stateProvider.
		state('listInstrumentos', {
			url: '/instrumentos',
			templateUrl: 'modules/instrumentos/views/list-instrumentos.client.view.html'
		}).
		state('createInstrumento', {
			url: '/instrumentos/create',
			templateUrl: 'modules/instrumentos/views/create-instrumento.client.view.html'
		}).
		state('viewInstrumento', {
			url: '/instrumentos/:instrumentoId',
			templateUrl: 'modules/instrumentos/views/view-instrumento.client.view.html'
		}).
		state('editInstrumento', {
			url: '/instrumentos/:instrumentoId/edit',
			templateUrl: 'modules/instrumentos/views/edit-instrumento.client.view.html'
		});
	}
]);