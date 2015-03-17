'use strict';

angular.module('sheets').controller('SheetUploadController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sheets', '$mdDialog', '$upload','$rootScope',
    function ($scope, $stateParams, $location, Authentication, Sheets, $mdDialog, $upload, $rootScope) {
        $scope.authentication = Authentication;
        $scope.saving = false;
        $scope.error = undefined;

        $scope.save = function () {
            if ($scope.file && $scope.music) {
                $scope.saving = true;
                var sheet = new Sheets ({
                    name: $scope.sheet.name,
                    instrument: $rootScope.instrument._id
                });
                var files = [$scope.file[0], $scope.music[0]];
                $upload.upload({
                    url: 'api/sheets',
                    fields: sheet,
                    file: files
                }).success(function (data, status, headers, config) {
                    $mdDialog.hide();
                });
            } else {
                $scope.error = 'Preencha todos os campos';
            }
        };
    }
]);
