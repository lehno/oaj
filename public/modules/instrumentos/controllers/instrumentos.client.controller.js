'use strict';

// Instrumentos controller
angular.module('instrumentos').controller('InstrumentosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Instrumentos',
	function($scope, $stateParams, $location, Authentication, Instrumentos) {
		$scope.authentication = Authentication;

		// Create new Instrumento
		$scope.create = function() {
			// Create new Instrumento object
			var instrumento = new Instrumentos ({
				name: this.name
			});

			// Redirect after save
			instrumento.$save(function(response) {
				$location.path('instrumentos');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Instrumento
		$scope.remove = function(instrumento) {
			if ( instrumento ) { 
				instrumento.$remove();

				for (var i in $scope.instrumentos) {
					if ($scope.instrumentos [i] === instrumento) {
						$scope.instrumentos.splice(i, 1);
					}
				}
			} else {
				$scope.instrumento.$remove(function() {
					$location.path('instrumentos');
				});
			}
		};

		// Update existing Instrumento
		$scope.update = function() {
			var instrumento = $scope.instrumento;

			instrumento.$update(function() {
				$location.path('instrumentos/' + instrumento._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Instrumentos
		$scope.find = function() {
			$scope.instrumentos = Instrumentos.query();
		};

		// Find existing Instrumento
		$scope.findOne = function() {
			$scope.instrumento = Instrumentos.get({ 
				instrumentoId: $stateParams.instrumentoId
			});
		};
	}
]);
