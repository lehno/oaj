'use strict';

angular.module('sheets').controller('SheetUploadController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sheets', '$mdDialog', '$upload',
    function ($scope, $stateParams, $location, Authentication, Sheets, $mdDialog, $upload) {
        $scope.authentication = Authentication;

        $scope.save = function () {
            if ($scope.file) {
                var sheet = new Sheets ({
                    name: $scope.sheet.name,
                    instrument: $scope.instruments[$scope.selectedIndex]
                });
                $upload.upload({
                    url: 'api/sheets',
                    fields: sheet,
                    file: $scope.file[0]
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        };
    }
]);
