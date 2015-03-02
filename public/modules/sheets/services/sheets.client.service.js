'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('sheets').factory('Sheets', ['$resource',
	function($resource) {
		return $resource('api/sheets/:sheetId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
