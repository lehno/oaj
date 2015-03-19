'use strict';

angular.module('sheets').controller('PhotoUploadController', ['$scope', '$stateParams', '$location', 'Authentication', 'Photos', '$mdDialog', '$upload','$mdToast',
    function ($scope, $stateParams, $location, Authentication, Photos, $mdDialog, $upload,$mdToast) {
        $scope.authentication = Authentication;
        $scope.featuredHor = false;
        $scope.featuredVer = false;
        $scope.saving = false;
        $scope.error = undefined;

        $scope.save = function () {
            if ($scope.file && $scope.photo.name) {
                $scope.saving = true;
                var photo = new Photos ({
                    name: $scope.photo.name,
                    featuredHor: $scope.photo.featuredHor,
                    featuredVer: $scope.photo.featuredVer
                });
                $upload.upload({
                    url: 'api/photos',
                    fields: photo,
                    file: $scope.file
                }).success(function (data, status, headers, config) {
                    $mdDialog.hide();
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Adicionado com sucesso!')
                            .position('top right')
                            .hideDelay(3000)
                    );
                });
            } else {
                $scope.error = 'Preencha todos os campos';
            }
        };
    }
]);
