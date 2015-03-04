'use strict';

angular.module('core').controller('MenuController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
        $scope.menu = [
            {link:'/fotos', title: 'Fotos',role: 'user'},
            {link:'/videos', title: 'Videos',role: 'user'},
            {link:'/partituras', title: 'Partituras',role: 'user'},
            {link:'/instrumentos',title: 'Instrumentos', role: 'admin'},
            {link:'/aprenda', title: 'Aprenda a tocar',role: 'user'},
            {link:'/auth/signout', title: 'Sair', role: 'user'}
        ]

	}
]);
