'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sheet = mongoose.model('Sheet'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sheet;

/**
 * Sheet routes tests
 */
describe('Sheet CRUD tests', function() {
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

		// Save a user to the test db and create new Sheet
		user.save(function() {
			sheet = {
				name: 'Sheet Name'
			};

			done();
		});
	});

	it('should be able to save Sheet instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sheet
				agent.post('/sheets')
					.send(sheet)
					.expect(200)
					.end(function(sheetSaveErr, sheetSaveRes) {
						// Handle Sheet save error
						if (sheetSaveErr) done(sheetSaveErr);

						// Get a list of Sheets
						agent.get('/sheets')
							.end(function(sheetsGetErr, sheetsGetRes) {
								// Handle Sheet save error
								if (sheetsGetErr) done(sheetsGetErr);

								// Get Sheets list
								var sheets = sheetsGetRes.body;

								// Set assertions
								(sheets[0].user._id).should.equal(userId);
								(sheets[0].name).should.match('Sheet Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sheet instance if not logged in', function(done) {
		agent.post('/sheets')
			.send(sheet)
			.expect(401)
			.end(function(sheetSaveErr, sheetSaveRes) {
				// Call the assertion callback
				done(sheetSaveErr);
			});
	});

	it('should not be able to save Sheet instance if no name is provided', function(done) {
		// Invalidate name field
		sheet.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sheet
				agent.post('/sheets')
					.send(sheet)
					.expect(400)
					.end(function(sheetSaveErr, sheetSaveRes) {
						// Set message assertion
						(sheetSaveRes.body.message).should.match('Please fill Sheet name');
						
						// Handle Sheet save error
						done(sheetSaveErr);
					});
			});
	});

	it('should be able to update Sheet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sheet
				agent.post('/sheets')
					.send(sheet)
					.expect(200)
					.end(function(sheetSaveErr, sheetSaveRes) {
						// Handle Sheet save error
						if (sheetSaveErr) done(sheetSaveErr);

						// Update Sheet name
						sheet.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sheet
						agent.put('/sheets/' + sheetSaveRes.body._id)
							.send(sheet)
							.expect(200)
							.end(function(sheetUpdateErr, sheetUpdateRes) {
								// Handle Sheet update error
								if (sheetUpdateErr) done(sheetUpdateErr);

								// Set assertions
								(sheetUpdateRes.body._id).should.equal(sheetSaveRes.body._id);
								(sheetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sheets if not signed in', function(done) {
		// Create new Sheet model instance
		var sheetObj = new Sheet(sheet);

		// Save the Sheet
		sheetObj.save(function() {
			// Request Sheets
			request(app).get('/sheets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sheet if not signed in', function(done) {
		// Create new Sheet model instance
		var sheetObj = new Sheet(sheet);

		// Save the Sheet
		sheetObj.save(function() {
			request(app).get('/sheets/' + sheetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sheet.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sheet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sheet
				agent.post('/sheets')
					.send(sheet)
					.expect(200)
					.end(function(sheetSaveErr, sheetSaveRes) {
						// Handle Sheet save error
						if (sheetSaveErr) done(sheetSaveErr);

						// Delete existing Sheet
						agent.delete('/sheets/' + sheetSaveRes.body._id)
							.send(sheet)
							.expect(200)
							.end(function(sheetDeleteErr, sheetDeleteRes) {
								// Handle Sheet error error
								if (sheetDeleteErr) done(sheetDeleteErr);

								// Set assertions
								(sheetDeleteRes.body._id).should.equal(sheetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sheet instance if not signed in', function(done) {
		// Set Sheet user 
		sheet.user = user;

		// Create new Sheet model instance
		var sheetObj = new Sheet(sheet);

		// Save the Sheet
		sheetObj.save(function() {
			// Try deleting Sheet
			request(app).delete('/sheets/' + sheetObj._id)
			.expect(401)
			.end(function(sheetDeleteErr, sheetDeleteRes) {
				// Set message assertion
				(sheetDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sheet error error
				done(sheetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Sheet.remove().exec();
		done();
	});
});