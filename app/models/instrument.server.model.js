'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Instrument Schema
 */
var InstrumentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Instrument name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Instrument', InstrumentSchema);
