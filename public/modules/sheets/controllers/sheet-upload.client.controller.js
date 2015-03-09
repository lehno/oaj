'use strict';

angular.module('sheets').controller('SheetUploadController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sheets', '$mdDialog', '$upload','$rootScope',
    function ($scope, $stateParams, $location, Authentication, Sheets, $mdDialog, $upload, $rootScope) {
        $scope.authentication = Authentication;

        $scope.save = function () {
            if ($scope.file) {
                var sheet = new Sheets ({
                    name: $scope.sheet.name,
                    instrument: $rootScope.instrument
                });
                $upload.upload({
                    url: 'api/sheets',
                    fields: sheet,
                    file: $scope.file[0]
                }).success(function (data, status, headers, config) {
                    $mdDialog.hide();
                });
            }
        };
    }
]);
