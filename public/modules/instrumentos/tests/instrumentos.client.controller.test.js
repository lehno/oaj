'use strict';

(function() {
	// Instrumentos Controller Spec
	describe('Instrumentos Controller Tests', function() {
		// Initialize global variables
		var InstrumentosController,
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

			// Initialize the Instrumentos controller.
			InstrumentosController = $controller('InstrumentosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Instrumento object fetched from XHR', inject(function(Instrumentos) {
			// Create sample Instrumento using the Instrumentos service
			var sampleInstrumento = new Instrumentos({
				name: 'New Instrumento'
			});

			// Create a sample Instrumentos array that includes the new Instrumento
			var sampleInstrumentos = [sampleInstrumento];

			// Set GET response
			$httpBackend.expectGET('instrumentos').respond(sampleInstrumentos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.instrumentos).toEqualData(sampleInstrumentos);
		}));

		it('$scope.findOne() should create an array with one Instrumento object fetched from XHR using a instrumentoId URL parameter', inject(function(Instrumentos) {
			// Define a sample Instrumento object
			var sampleInstrumento = new Instrumentos({
				name: 'New Instrumento'
			});

			// Set the URL parameter
			$stateParams.instrumentoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/instrumentos\/([0-9a-fA-F]{24})$/).respond(sampleInstrumento);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.instrumento).toEqualData(sampleInstrumento);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Instrumentos) {
			// Create a sample Instrumento object
			var sampleInstrumentoPostData = new Instrumentos({
				name: 'New Instrumento'
			});

			// Create a sample Instrumento response
			var sampleInstrumentoResponse = new Instrumentos({
				_id: '525cf20451979dea2c000001',
				name: 'New Instrumento'
			});

			// Fixture mock form input values
			scope.name = 'New Instrumento';

			// Set POST response
			$httpBackend.expectPOST('instrumentos', sampleInstrumentoPostData).respond(sampleInstrumentoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Instrumento was created
			expect($location.path()).toBe('/instrumentos/' + sampleInstrumentoResponse._id);
		}));

		it('$scope.update() should update a valid Instrumento', inject(function(Instrumentos) {
			// Define a sample Instrumento put data
			var sampleInstrumentoPutData = new Instrumentos({
				_id: '525cf20451979dea2c000001',
				name: 'New Instrumento'
			});

			// Mock Instrumento in scope
			scope.instrumento = sampleInstrumentoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/instrumentos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/instrumentos/' + sampleInstrumentoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid instrumentoId and remove the Instrumento from the scope', inject(function(Instrumentos) {
			// Create new Instrumento object
			var sampleInstrumento = new Instrumentos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Instrumentos array and include the Instrumento
			scope.instrumentos = [sampleInstrumento];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/instrumentos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInstrumento);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.instrumentos.length).toBe(0);
		}));
	});
}());