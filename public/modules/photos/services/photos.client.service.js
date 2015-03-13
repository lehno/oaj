'use strict';

//Photos service used to communicate Photos REST endpoints
angular.module('photos').factory('Photos', ['$resource',
	function($resource) {
		return $resource('api/photos/:photoId', { photoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
