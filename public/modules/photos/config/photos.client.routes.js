'use strict';

//Setting up route
angular.module('photos').config(['$stateProvider',
	function($stateProvider) {
		// Photos state routing
		$stateProvider.
		state('listPhotos', {
			url: '/fotos',
			templateUrl: 'modules/photos/views/list-photos.client.view.html'
		}).
		state('createPhoto', {
			url: '/fotos/nova',
			templateUrl: 'modules/photos/views/create-photo.client.view.html'
		}).
		state('viewPhoto', {
			url: '/fotos/:photoId',
			templateUrl: 'modules/photos/views/view-photo.client.view.html'
		}).
		state('editPhoto', {
			url: '/fotos/:photoId/editar',
			templateUrl: 'modules/photos/views/edit-photo.client.view.html'
		});
	}
]);
