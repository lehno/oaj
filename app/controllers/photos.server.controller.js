'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Photo = mongoose.model('Photo'),
    _ = require('lodash'),
    fs = require('fs'),
    multiparty = require('multiparty');


var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

/**
 * Create a Photo
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
        writeStream.on('close', function (musicFile) {
            var photo = new Photo({
                name: fields.name[0],
                photoFileId: musicFile._id
            });
            fs.unlink(files.file[0].path);
            photo.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(photo);
                }
            });
        });
        fs.createReadStream(files.file[0].path).pipe(writeStream);
    });
};

/**
 * Show the current Photo
 */
exports.read = function (req, res) {
    res.jsonp(req.photo);
};

/**
 * Update a Photo
 */
exports.update = function (req, res) {
    var photo = req.photo;

    photo = _.extend(photo, req.body);

    photo.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(photo);
        }
    });
};

/**
 * Delete an Photo
 */
exports.delete = function (req, res) {
    var photo = req.photo;

    photo.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(photo);
        }
    });
};

/**
 * List of Photos
 */
exports.list = function (req, res) {
    Photo.find().sort('-created').populate('user', 'displayName').exec(function (err, photos) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(photos);
        }
    });
};

/**
 * Photo middleware
 */
exports.photoByID = function (req, res, next, id) {
    Photo.findById(id).populate('user', 'displayName').exec(function (err, photo) {
        if (err) return next(err);
        if (!photo) return next(new Error('Failed to load Photo ' + id));
        req.photo = photo;
        next();
    });
};

/**
 * Photo authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.photo.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
