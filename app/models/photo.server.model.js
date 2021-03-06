'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Photo Schema
 */
var PhotoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Photo name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
    photoFileId: {
        type: String,
        default: '',
        required: 'Necessario informar o arquivo de imagem'
    },
    featuredHor: {
        type: Boolean,
        default: false
    },
    featuredVer: {
        type: Boolean,
        default: false
    },
    user : {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Photo', PhotoSchema);
