'use strict';

angular.module('photos').directive('backgroundImageDirective', function () {
    return function (scope, element, attrs) {
        element.css({
            'background': 'url(api/download?file=' + attrs.backgroundImageDirective + ') center no-repeat',
            'background-size' : 'cover'
        });
    };
});
