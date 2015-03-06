'use strict';

//Instruments service used to communicate Instruments REST endpoints
angular.module('instruments').factory('Instruments', ['$resource',
	function($resource) {
		return $resource('api/instruments/:instrumentId', { instrumentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
