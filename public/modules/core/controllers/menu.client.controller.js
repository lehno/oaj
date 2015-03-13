'use strict';

angular.module('core').controller('MenuController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
        $scope.menu = [
            {link:'/fotos', title: 'Fotos',role: 'user'},
            {link:'/videos', title: 'Videos',role: 'user'},
            {link:'/partituras', title: 'Partituras',role: 'user'},
            {link:'/instrumentos',title: 'Instrumentos', role: 'admin'}
        ];

        $scope.isVisible = function(role){
            if ($scope.authentication.user){
                return $scope.authentication.user.roles.indexOf(role) >= 0;
            } else {
                return false;
            }
        };
	}
]);
