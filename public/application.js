'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
        $locationProvider.html5Mode(true);
	}
]);

angular.module(ApplicationConfiguration.applicationModuleName).config(['$mdThemingProvider',
	function($mdThemingProvider) {
        $mdThemingProvider.definePalette('green-oaj', {
            '50': 'E8F5E9',
            '100': 'C8E6C9',
            '200': 'A5D6A7',
            '300': '81C784',
            '400': '66BB6A',
            '500': '125251',
            '600': '239190',
            '700': '388E3C',
            '800': '2E7D32',
            '900': '1B5E20',
            'A100': 'B9F6CA',
            'A200': '69F0AE',
            'A400': '00E676',
            'A700': '00C853',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
        $mdThemingProvider.definePalette('gold-oaj', {
            '50': 'FFF8E1',
            '100': 'FFECB3',
            '200': 'FFE082',
            '300': 'FFD54F',
            '400': 'FFCA28',
            '500': 'FFC137',
            '600': 'FFB300',
            '700': 'FFC137',
            '800': 'FF8F00',
            '900': 'FF6F00',
            'A100': 'FFE57F',
            'A200': 'FFC137',
            'A400': 'FFC400',
            'A700': 'FFAB00',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
		$mdThemingProvider.theme('default')
			.primaryPalette('green-oaj')
			.accentPalette('gold-oaj');
	}
]);


//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
