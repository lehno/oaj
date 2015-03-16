'use strict';

angular.module('sheets').controller('ViewPhotoController', ['$scope', '$stateParams', '$location', 'Authentication', 'Photos', '$mdDialog','$rootScope',
    function ($scope, $stateParams, $location, Authentication, Photos, $mdDialog, $rootScope) {
        $scope.authentication = Authentication;
        $scope.photo =  $rootScope.photo;
    }
]);
