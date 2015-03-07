'use strict';

// Sheets controller
angular.module('sheets').controller('SheetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sheets','Instruments','$mdDialog','$rootScope',
	function($scope, $stateParams, $location, Authentication, Sheets,Instruments, $mdDialog, $rootScope) {
		$scope.authentication = Authentication;
        $scope.instruments = [];
        $scope.selectedIndex = 2;
        // Find a list of Instrumentos
        $scope.findInstruments = function() {
            $scope.instruments = Instruments.query();
        };

        $scope.newSheet = function (ev) {
            $rootScope.instrument = $scope.instruments[$scope.selectedIndex];
            $mdDialog.show({
                controller: 'SheetUploadController',
                templateUrl: 'modules/sheets/views/create-sheet.client.view.html',
                targetEvent: ev
            });
        };
		// Create new Sheet
		$scope.create = function() {
			// Create new Sheet object
			var sheet = new Sheets ({
				name: this.name
			});

			// Redirect after save
			sheet.$save(function(response) {
				$location.path('sheets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sheet
		$scope.remove = function(sheet) {
			if ( sheet ) { 
				sheet.$remove();

				for (var i in $scope.sheets) {
					if ($scope.sheets [i] === sheet) {
						$scope.sheets.splice(i, 1);
					}
				}
			} else {
				$scope.sheet.$remove(function() {
					$location.path('sheets');
				});
			}
		};

		// Update existing Sheet
		$scope.update = function() {
			var sheet = $scope.sheet;

			sheet.$update(function() {
				$location.path('sheets/' + sheet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sheets
		$scope.find = function() {
			$scope.sheets = Sheets.query();
		};

		// Find existing Sheet
		$scope.findOne = function() {
			$scope.sheet = Sheets.get({ 
				sheetId: $stateParams.sheetId
			});
		};
	}
]);
