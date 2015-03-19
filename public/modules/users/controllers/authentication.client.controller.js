'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication','$mdDialog','$mdToast',
	function($scope, $http, $location, Authentication,$mdDialog,$mdToast) {
		$scope.authentication = Authentication;
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

        $scope.instruments = [];
        $scope.loadInstruments = function() {
            return $http.get('/api/instruments').success(function(data){
                $scope.instruments = data;
            });
        };

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				// And redirect to the index page
				$location.path('/');
                $mdToast.show(
                    $mdToast.simple()
                        .content('Simple Toast!')
                        .position('top rigth')
                        .hideDelay(3000)
                );
                $mdDialog.hide();
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
                $mdToast.show(
                    $mdToast.simple()
                        .content('Bem vindo!')
                        .position('top right')
                        .hideDelay(3000)
                );
				// And redirect to the index page
				$location.path('/');
                $mdDialog.hide();
            }).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
