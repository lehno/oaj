'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Sheet = mongoose.model('Sheet'),
    _ = require('lodash'),
    fs = require('fs'),
    multiparty = require('multiparty');


var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);


/**
 * Create a Sheet
 */
exports.create = function (req, res) {
    var form = new multiparty.Form({
        autoFiles: true,
        uploadDir: './uploads'
    });
    form.parse(req, function(err, fields, files) {
        var writeStream = gfs.createWriteStream({
            _id: mongoose.Types.ObjectId(),
            filename: files.file[0].originalFilename,
            mode: 'w',
            content_type: files.file[0].headers[Object.keys(files.file[0].headers)[1]]
        });
        writeStream.on('close', function (sheetFile) {
            var writeStream = gfs.createWriteStream({
                _id: mongoose.Types.ObjectId(),
                filename: files.file[1].originalFilename,
                mode: 'w',
                content_type: files.file[1].headers[Object.keys(files.file[1].headers)[1]]
            });
            fs.unlink(files.file[0].path);
            writeStream.on('close', function (musicFile) {
                var sheet = new Sheet({
                    name: fields.name,
                    instrument: fields.instrument,
                    sheetFileId: sheetFile._id,
                    musicFileId: musicFile._id,
                    user: req.user
                });
                fs.unlink(files.file[1].path);
                sheet.save(function (err) {
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
            fs.createReadStream(files.file[1].path).pipe(writeStream);
        });
        fs.createReadStream(files.file[0].path).pipe(writeStream);
    });
};



/**
 * Show the current Sheet
 */
exports.read = function (req, res) {
    res.jsonp(req.sheet);
};

/**
 * Update a Sheet
 */
exports.update = function (req, res) {
    var sheet = req.sheet;

    sheet = _.extend(sheet, req.body);

    sheet.save(function (err) {
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
exports.delete = function (req, res) {
    var sheet = req.sheet;

    sheet.remove(function (err) {
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
exports.list = function (req, res) {
    if (req.query.instrument) {
        Sheet.find({instrument: req.query.instrument}).sort('name').exec(function (err, sheets) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(sheets);
            }
        });
    } else {
        Sheet.find().sort('name').exec(function (err, sheets) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(sheets);
            }
        });
    }
};

/**
 * Sheet middleware
 */
exports.sheetByID = function (req, res, next, id) {
    Sheet.findById(id).exec(function (err, sheet) {
        if (err) return next(err);
        if (!sheet) return next(new Error('Failed to load Sheet ' + id));
        req.sheet = sheet;
        next();
    });
};

/**
 * Sheet authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.sheet.user.toString() !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
