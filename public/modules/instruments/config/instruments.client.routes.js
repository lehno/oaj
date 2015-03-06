'use strict';

//Setting up route
angular.module('instruments').config(['$stateProvider',
	function($stateProvider) {
		// Instruments state routing
		$stateProvider.
		state('listInstruments', {
			url: '/instrumentos',
			templateUrl: 'modules/instruments/views/list-instruments.client.view.html'
		}).
		state('createInstrument', {
			url: '/instrumentos/adicionar',
			templateUrl: 'modules/instruments/views/create-instrument.client.view.html'
		}).
		state('viewInstrument', {
			url: '/instrumentos/:instrumentId',
			templateUrl: 'modules/instruments/views/view-instrument.client.view.html'
		}).
		state('editInstrument', {
			url: '/instrumentos/:instrumentId/editar',
			templateUrl: 'modules/instruments/views/edit-instrument.client.view.html'
		});
	}
]);
