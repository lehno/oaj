'use strict';

// Instruments controller
angular.module('instruments').controller('InstrumentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Instruments',
	function($scope, $stateParams, $location, Authentication, Instruments) {
		$scope.authentication = Authentication;

		// Create new Instrument
		$scope.create = function() {
			// Create new Instrument object
			var instrument = new Instruments ({
				name: this.name
			});

			// Redirect after save
			instrument.$save(function(response) {
				$location.path('instrumentos');
                $scope.instruments.push(response);
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Instrument
		$scope.remove = function(instrument) {
			if ( instrument ) { 
				instrument.$remove();

				for (var i in $scope.instruments) {
					if ($scope.instruments [i] === instrument) {
						$scope.instruments.splice(i, 1);
					}
				}
			} else {
				$scope.instrument.$remove(function() {
					$location.path('instruments');
				});
			}
		};

		// Update existing Instrument
		$scope.update = function() {
			var instrument = $scope.instrument;

			instrument.$update(function() {
				$location.path('instruments/' + instrument._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Instruments
		$scope.find = function() {
			$scope.instruments = Instruments.query();
		};

		// Find existing Instrument
		$scope.findOne = function() {
			$scope.instrument = Instruments.get({ 
				instrumentId: $stateParams.instrumentId
			});
		};
	}
]);
