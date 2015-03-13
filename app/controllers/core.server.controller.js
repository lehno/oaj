'use strict';
var mongoose = require('mongoose'),
    Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;

var gfs = new Grid(mongoose.connection.db);

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.getFile = function (req, res) {
    gfs.files.find({_id: mongoose.Types.ObjectId(req.query.file)}).toArray(function (err, files) {
        if (files.length === 0) {
            return res.status(400).send({
                message: 'File not found'
            });
        }

        res.writeHead(200, {'Content-Type': files[0].contentType});

        var readstream = gfs.createReadStream({
            filename: files[0].filename
        });

        readstream.on('data', function (data) {
            res.write(data);
        });

        readstream.on('end', function () {
            res.end();
        });

        readstream.on('error', function (err) {
            console.log('An error occurred!', err);
            throw err;
        });
    });
};
