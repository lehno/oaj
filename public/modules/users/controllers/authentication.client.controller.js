'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication','$mdDialog',
	function($scope, $http, $location, Authentication,$mdDialog) {
		$scope.authentication = Authentication;
		$scope.instruments = ['Piano', 'Violino', 'Violoncelo', 'Violão','Sax Alto', 'Sax Tenor', 'Trompete','Trombone','Trombone de Vara','Tuba', 'Trompa','Percussão','Viola','Clarinete','Flauta Transversal','Flauta Doce','Flauta Contralto','Contrabaixo Acustico'];
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				// And redirect to the index page
				$location.path('/');
                $mdDialog.hide();
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
                $mdDialog.hide();
            }).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
