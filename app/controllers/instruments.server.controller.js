'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Instrument = mongoose.model('Instrument'),
	_ = require('lodash');

/**
 * Create a Instrument
 */
exports.create = function(req, res) {
	var instrument = new Instrument(req.body);
	instrument.user = req.user;

	instrument.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrument);
		}
	});
};

/**
 * Show the current Instrument
 */
exports.read = function(req, res) {
	res.jsonp(req.instrument);
};

/**
 * Update a Instrument
 */
exports.update = function(req, res) {
	var instrument = req.instrument ;

	instrument = _.extend(instrument , req.body);

	instrument.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrument);
		}
	});
};

/**
 * Delete an Instrument
 */
exports.delete = function(req, res) {
	var instrument = req.instrument ;

	instrument.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrument);
		}
	});
};

/**
 * List of Instruments
 */
exports.list = function(req, res) { 
	Instrument.find().sort('-created').populate('user', 'displayName').exec(function(err, instruments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instruments);
		}
	});
};

/**
 * Instrument middleware
 */
exports.instrumentByID = function(req, res, next, id) { 
	Instrument.findById(id).populate('user', 'displayName').exec(function(err, instrument) {
		if (err) return next(err);
		if (! instrument) return next(new Error('Failed to load Instrument ' + id));
		req.instrument = instrument ;
		next();
	});
};

/**
 * Instrument authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.instrument.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
