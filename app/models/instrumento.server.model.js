'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Instrumento Schema
 */
var InstrumentoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Instrumento name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Instrumento', InstrumentoSchema);
