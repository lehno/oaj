'use strict';

(function() {
	// Sheets Controller Spec
	describe('Sheets Controller Tests', function() {
		// Initialize global variables
		var SheetsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Sheets controller.
			SheetsController = $controller('SheetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sheet object fetched from XHR', inject(function(Sheets) {
			// Create sample Sheet using the Sheets service
			var sampleSheet = new Sheets({
				name: 'New Sheet'
			});

			// Create a sample Sheets array that includes the new Sheet
			var sampleSheets = [sampleSheet];

			// Set GET response
			$httpBackend.expectGET('sheets').respond(sampleSheets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sheets).toEqualData(sampleSheets);
		}));

		it('$scope.findOne() should create an array with one Sheet object fetched from XHR using a sheetId URL parameter', inject(function(Sheets) {
			// Define a sample Sheet object
			var sampleSheet = new Sheets({
				name: 'New Sheet'
			});

			// Set the URL parameter
			$stateParams.sheetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sheets\/([0-9a-fA-F]{24})$/).respond(sampleSheet);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sheet).toEqualData(sampleSheet);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sheets) {
			// Create a sample Sheet object
			var sampleSheetPostData = new Sheets({
				name: 'New Sheet'
			});

			// Create a sample Sheet response
			var sampleSheetResponse = new Sheets({
				_id: '525cf20451979dea2c000001',
				name: 'New Sheet'
			});

			// Fixture mock form input values
			scope.name = 'New Sheet';

			// Set POST response
			$httpBackend.expectPOST('sheets', sampleSheetPostData).respond(sampleSheetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sheet was created
			expect($location.path()).toBe('/sheets/' + sampleSheetResponse._id);
		}));

		it('$scope.update() should update a valid Sheet', inject(function(Sheets) {
			// Define a sample Sheet put data
			var sampleSheetPutData = new Sheets({
				_id: '525cf20451979dea2c000001',
				name: 'New Sheet'
			});

			// Mock Sheet in scope
			scope.sheet = sampleSheetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sheets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sheets/' + sampleSheetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sheetId and remove the Sheet from the scope', inject(function(Sheets) {
			// Create new Sheet object
			var sampleSheet = new Sheets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sheets array and include the Sheet
			scope.sheets = [sampleSheet];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sheets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSheet);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sheets.length).toBe(0);
		}));
	});
}());