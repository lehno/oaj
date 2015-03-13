'use strict';

angular.module('sheets').controller('PhotoUploadController', ['$scope', '$stateParams', '$location', 'Authentication', 'Photos', '$mdDialog', '$upload',
    function ($scope, $stateParams, $location, Authentication, Photos, $mdDialog, $upload) {
        $scope.authentication = Authentication;

        $scope.save = function () {
            if ($scope.file) {
                var photo = new Photos ({
                    name: $scope.photo.name
                });
                $upload.upload({
                    url: 'api/photos',
                    fields: photo,
                    file: $scope.file
                }).success(function (data, status, headers, config) {
                    $mdDialog.hide();
                });
            }
        };
    }
]);
