'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Instrumento = mongoose.model('Instrumento'),
	_ = require('lodash');

/**
 * Create a Instrumento
 */
exports.create = function(req, res) {
	var instrumento = new Instrumento(req.body);
	instrumento.user = req.user;

	instrumento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumento);
		}
	});
};

/**
 * Show the current Instrumento
 */
exports.read = function(req, res) {
	res.jsonp(req.instrumento);
};

/**
 * Update a Instrumento
 */
exports.update = function(req, res) {
	var instrumento = req.instrumento ;

	instrumento = _.extend(instrumento , req.body);

	instrumento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumento);
		}
	});
};

/**
 * Delete an Instrumento
 */
exports.delete = function(req, res) {
	var instrumento = req.instrumento ;

	instrumento.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumento);
		}
	});
};

/**
 * List of Instrumentos
 */
exports.list = function(req, res) { 
	Instrumento.find().sort('-created').populate('user', 'displayName').exec(function(err, instrumentos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(instrumentos);
		}
	});
};

/**
 * Instrumento middleware
 */
exports.instrumentoByID = function(req, res, next, id) { 
	Instrumento.findById(id).populate('user', 'displayName').exec(function(err, instrumento) {
		if (err) return next(err);
		if (! instrumento) return next(new Error('Failed to load Instrumento ' + id));
		req.instrumento = instrumento ;
		next();
	});
};

/**
 * Instrumento authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.instrumento.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
