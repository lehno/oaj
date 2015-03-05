'use strict';

//Instrumentos service used to communicate Instrumentos REST endpoints
angular.module('instrumentos').factory('Instrumentos', ['$resource',
	function($resource) {
		return $resource('api/instrumentos/:instrumentoId', { instrumentoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
