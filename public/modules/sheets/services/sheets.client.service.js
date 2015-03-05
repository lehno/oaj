'use strict';

//Sheets service used to communicate Sheets REST endpoints
angular.module('sheets').factory('Sheets', ['$resource',
    function ($resource) {
        return $resource('api/sheets/:sheetId', {
            sheetId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
