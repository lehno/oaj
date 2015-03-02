'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication','$mdDialog','$mdSidenav',
	function($scope, Authentication,$mdDialog,$mdSidenav) {
		$scope.authentication = Authentication;

        $scope.showSignIn = function (ev) {
            $mdDialog.show({
                controller: 'AuthenticationController',
                templateUrl: 'modules/users/views/authentication/login.client.view.html',
                targetEvent: ev
            });
        };
        $scope.showSignUp = function (ev) {
            $mdDialog.show({
                controller: 'AuthenticationController',
                templateUrl: 'modules/users/views/authentication/signup.client.view.html',
                targetEvent: ev
            });
        };

        $scope.toggleLeft = function () {
            $mdSidenav('left').toggle();
        };
	}
]);
