'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sheet Schema
 */
var SheetSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Por favor, preencha o nome da partitura',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	instrument: {
		type: Schema.ObjectId,
		ref: 'Instrument'
	}
});

mongoose.model('Sheet', SheetSchema);
