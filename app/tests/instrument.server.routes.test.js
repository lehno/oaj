'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Instrument = mongoose.model('Instrument'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, instrument;

/**
 * Instrument routes tests
 */
describe('Instrument CRUD tests', function() {
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

		// Save a user to the test db and create new Instrument
		user.save(function() {
			instrument = {
				name: 'Instrument Name'
			};

			done();
		});
	});

	it('should be able to save Instrument instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrument
				agent.post('/instruments')
					.send(instrument)
					.expect(200)
					.end(function(instrumentSaveErr, instrumentSaveRes) {
						// Handle Instrument save error
						if (instrumentSaveErr) done(instrumentSaveErr);

						// Get a list of Instruments
						agent.get('/instruments')
							.end(function(instrumentsGetErr, instrumentsGetRes) {
								// Handle Instrument save error
								if (instrumentsGetErr) done(instrumentsGetErr);

								// Get Instruments list
								var instruments = instrumentsGetRes.body;

								// Set assertions
								(instruments[0].user._id).should.equal(userId);
								(instruments[0].name).should.match('Instrument Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Instrument instance if not logged in', function(done) {
		agent.post('/instruments')
			.send(instrument)
			.expect(401)
			.end(function(instrumentSaveErr, instrumentSaveRes) {
				// Call the assertion callback
				done(instrumentSaveErr);
			});
	});

	it('should not be able to save Instrument instance if no name is provided', function(done) {
		// Invalidate name field
		instrument.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrument
				agent.post('/instruments')
					.send(instrument)
					.expect(400)
					.end(function(instrumentSaveErr, instrumentSaveRes) {
						// Set message assertion
						(instrumentSaveRes.body.message).should.match('Please fill Instrument name');
						
						// Handle Instrument save error
						done(instrumentSaveErr);
					});
			});
	});

	it('should be able to update Instrument instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrument
				agent.post('/instruments')
					.send(instrument)
					.expect(200)
					.end(function(instrumentSaveErr, instrumentSaveRes) {
						// Handle Instrument save error
						if (instrumentSaveErr) done(instrumentSaveErr);

						// Update Instrument name
						instrument.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Instrument
						agent.put('/instruments/' + instrumentSaveRes.body._id)
							.send(instrument)
							.expect(200)
							.end(function(instrumentUpdateErr, instrumentUpdateRes) {
								// Handle Instrument update error
								if (instrumentUpdateErr) done(instrumentUpdateErr);

								// Set assertions
								(instrumentUpdateRes.body._id).should.equal(instrumentSaveRes.body._id);
								(instrumentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Instruments if not signed in', function(done) {
		// Create new Instrument model instance
		var instrumentObj = new Instrument(instrument);

		// Save the Instrument
		instrumentObj.save(function() {
			// Request Instruments
			request(app).get('/instruments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Instrument if not signed in', function(done) {
		// Create new Instrument model instance
		var instrumentObj = new Instrument(instrument);

		// Save the Instrument
		instrumentObj.save(function() {
			request(app).get('/instruments/' + instrumentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', instrument.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Instrument instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Instrument
				agent.post('/instruments')
					.send(instrument)
					.expect(200)
					.end(function(instrumentSaveErr, instrumentSaveRes) {
						// Handle Instrument save error
						if (instrumentSaveErr) done(instrumentSaveErr);

						// Delete existing Instrument
						agent.delete('/instruments/' + instrumentSaveRes.body._id)
							.send(instrument)
							.expect(200)
							.end(function(instrumentDeleteErr, instrumentDeleteRes) {
								// Handle Instrument error error
								if (instrumentDeleteErr) done(instrumentDeleteErr);

								// Set assertions
								(instrumentDeleteRes.body._id).should.equal(instrumentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Instrument instance if not signed in', function(done) {
		// Set Instrument user 
		instrument.user = user;

		// Create new Instrument model instance
		var instrumentObj = new Instrument(instrument);

		// Save the Instrument
		instrumentObj.save(function() {
			// Try deleting Instrument
			request(app).delete('/instruments/' + instrumentObj._id)
			.expect(401)
			.end(function(instrumentDeleteErr, instrumentDeleteRes) {
				// Set message assertion
				(instrumentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Instrument error error
				done(instrumentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Instrument.remove().exec();
		done();
	});
});