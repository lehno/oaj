'use strict';

angular.module('core').controller('MenuController', ['$scope', 'Authentication', '$location', '$mdSidenav',
    function ($scope, Authentication, $location, $mdSidenav) {
        $scope.authentication = Authentication;
        $scope.menu = [
            {link: '/fotos', title: 'Fotos', role: 'user'},
            {link: '/videos', title: 'Videos', role: 'user'},
            {link: '/partituras', title: 'Partituras', role: 'user'},
            {link: '/instrumentos', title: 'Instrumentos', role: 'admin'}
        ];

        $scope.isVisible = function (role) {
            if ($scope.authentication.user) {
                return $scope.authentication.user.roles.indexOf(role) >= 0;
            } else {
                return false;
            }
        };

        $scope.openLink = function (link) {
            $location.path(link);
            $mdSidenav('left').toggle();
        };
    }
]);
