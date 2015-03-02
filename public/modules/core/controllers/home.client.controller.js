'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$mdDialog',
    function ($scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

    }
]);
