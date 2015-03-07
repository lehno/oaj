'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sheet = mongoose.model('Sheet'),
	_ = require('lodash'),
    fs = require('fs');

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

/**
 * Create a Sheet
 */
exports.create = function(req, res) {

    var part = req.files.file;

    var writeStream = gfs.createWriteStream({
        _id: mongoose.Types.ObjectId(),
        filename: part.name,
        mode: 'w',
        content_type:part.mimetype
    });
    writeStream.on('close', function(file) {
        var sheet = new Sheet();
        sheet.name = req.body.name;
        sheet.sheetFileId = file._id;
        sheet.Istrument = JSON.parse(req.body.instrument);
        sheet.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.status(200).jsonp({
                    message: 'Success'
                });
            }
        });
    });
    writeStream.write(part.data);
    writeStream.end();
};

/**
 * Show the current Sheet
 */
exports.read = function(req, res) {
	res.jsonp(req.sheet);
};

/**
 * Update a Sheet
 */
exports.update = function(req, res) {
	var sheet = req.sheet ;

	sheet = _.extend(sheet , req.body);

	sheet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sheet);
		}
	});
};

/**
 * Delete an Sheet
 */
exports.delete = function(req, res) {
	var sheet = req.sheet ;

	sheet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sheet);
		}
	});
};

/**
 * List of Sheets
 */
exports.list = function(req, res) { 
	Sheet.find().sort('-created').populate('user', 'displayName').exec(function(err, sheets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sheets);
		}
	});
};

/**
 * Sheet middleware
 */
exports.sheetByID = function(req, res, next, id) { 
	Sheet.findById(id).populate('user', 'displayName').exec(function(err, sheet) {
		if (err) return next(err);
		if (! sheet) return next(new Error('Failed to load Sheet ' + id));
		req.sheet = sheet ;
		next();
	});
};

/**
 * Sheet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sheet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
