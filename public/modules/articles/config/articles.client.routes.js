'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-sheets.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-sheets.client.view.html'
		});
	}
]);
