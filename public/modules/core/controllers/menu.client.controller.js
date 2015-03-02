'use strict';

angular.module('core').controller('MenuController', ['$scope', 'Authentication','$mdSidenav',
	function($scope, Authentication,$mdSidenav) {
		$scope.authentication = Authentication;
        $scope.menu = [
            {link:'/fotos', title: 'Fotos'},
            {link:'/videos', title: 'Videos'},
            {link:'/partituras', title: 'Partituras'},
            {link:'/aprenda', title: 'Aprenda a tocar'},
            {link:'/auth/signout', title: 'Sair'}
        ]

	}
]);
