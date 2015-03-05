'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Instrumento = mongoose.model('Instrumento'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, instrumento;

/**
 * Instrumento routes tests
 */
describe('Instrumento CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Instrumento
		user.save(function() {
			instrumento = {
				name: 'Instrumento Name'
			};

			done();
		});
	});

	it('should be able to save Instrumento instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrumento
				agent.post('/instrumentos')
					.send(instrumento)
					.expect(200)
					.end(function(instrumentoSaveErr, instrumentoSaveRes) {
						// Handle Instrumento save error
						if (instrumentoSaveErr) done(instrumentoSaveErr);

						// Get a list of Instrumentos
						agent.get('/instrumentos')
							.end(function(instrumentosGetErr, instrumentosGetRes) {
								// Handle Instrumento save error
								if (instrumentosGetErr) done(instrumentosGetErr);

								// Get Instrumentos list
								var instrumentos = instrumentosGetRes.body;

								// Set assertions
								(instrumentos[0].user._id).should.equal(userId);
								(instrumentos[0].name).should.match('Instrumento Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Instrumento instance if not logged in', function(done) {
		agent.post('/instrumentos')
			.send(instrumento)
			.expect(401)
			.end(function(instrumentoSaveErr, instrumentoSaveRes) {
				// Call the assertion callback
				done(instrumentoSaveErr);
			});
	});

	it('should not be able to save Instrumento instance if no name is provided', function(done) {
		// Invalidate name field
		instrumento.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrumento
				agent.post('/instrumentos')
					.send(instrumento)
					.expect(400)
					.end(function(instrumentoSaveErr, instrumentoSaveRes) {
						// Set message assertion
						(instrumentoSaveRes.body.message).should.match('Please fill Instrumento name');
						
						// Handle Instrumento save error
						done(instrumentoSaveErr);
					});
			});
	});

	it('should be able to update Instrumento instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrumento
				agent.post('/instrumentos')
					.send(instrumento)
					.expect(200)
					.end(function(instrumentoSaveErr, instrumentoSaveRes) {
						// Handle Instrumento save error
						if (instrumentoSaveErr) done(instrumentoSaveErr);

						// Update Instrumento name
						instrumento.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Instrumento
						agent.put('/instrumentos/' + instrumentoSaveRes.body._id)
							.send(instrumento)
							.expect(200)
							.end(function(instrumentoUpdateErr, instrumentoUpdateRes) {
								// Handle Instrumento update error
								if (instrumentoUpdateErr) done(instrumentoUpdateErr);

								// Set assertions
								(instrumentoUpdateRes.body._id).should.equal(instrumentoSaveRes.body._id);
								(instrumentoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Instrumentos if not signed in', function(done) {
		// Create new Instrumento model instance
		var instrumentoObj = new Instrumento(instrumento);

		// Save the Instrumento
		instrumentoObj.save(function() {
			// Request Instrumentos
			request(app).get('/instrumentos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Instrumento if not signed in', function(done) {
		// Create new Instrumento model instance
		var instrumentoObj = new Instrumento(instrumento);

		// Save the Instrumento
		instrumentoObj.save(function() {
			request(app).get('/instrumentos/' + instrumentoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', instrumento.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Instrumento instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrumento
				agent.post('/instrumentos')
					.send(instrumento)
					.expect(200)
					.end(function(instrumentoSaveErr, instrumentoSaveRes) {
						// Handle Instrumento save error
						if (instrumentoSaveErr) done(instrumentoSaveErr);

						// Delete existing Instrumento
						agent.delete('/instrumentos/' + instrumentoSaveRes.body._id)
							.send(instrumento)
							.expect(200)
							.end(function(instrumentoDeleteErr, instrumentoDeleteRes) {
								// Handle Instrumento error error
								if (instrumentoDeleteErr) done(instrumentoDeleteErr);

								// Set assertions
								(instrumentoDeleteRes.body._id).should.equal(instrumentoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Instrumento instance if not signed in', function(done) {
		// Set Instrumento user 
		instrumento.user = user;

		// Create new Instrumento model instance
		var instrumentoObj = new Instrumento(instrumento);

		// Save the Instrumento
		instrumentoObj.save(function() {
			// Try deleting Instrumento
			request(app).delete('/instrumentos/' + instrumentoObj._id)
			.expect(401)
			.end(function(instrumentoDeleteErr, instrumentoDeleteRes) {
				// Set message assertion
				(instrumentoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Instrumento error error
				done(instrumentoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Instrumento.remove().exec();
		done();
	});
});