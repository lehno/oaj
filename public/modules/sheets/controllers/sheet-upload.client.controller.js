'use strict';

angular.module('sheets').controller('SheetUploadController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sheets','$mdDialog',
    function($scope, $stateParams, $location, Authentication, Sheets, $mdDialog) {
        $scope.authentication = Authentication;

	}
]);
