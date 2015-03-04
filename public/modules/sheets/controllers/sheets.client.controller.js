'use strict';

angular.module('sheets').controller('SheetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Instrumentos',
	function($scope, $stateParams, $location, Authentication, Instrumentos) {
		$scope.authentication = Authentication;
        $scope.instrumentos = [];
        $scope.selectedIndex = 2;
        // Find a list of Instrumentos
        $scope.find = function() {
            $scope.instrumentos = Instrumentos.query();
        };
	}
]);
