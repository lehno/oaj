'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','$mdDialog',
    function ($scope, Authentication,$mdDialog) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.showAdvanced = function (ev) {
            $mdDialog.show({
                templateUrl: 'modules/core/views/login.client.view.html',
                targetEvent: ev
            });
        };
    }
]);
