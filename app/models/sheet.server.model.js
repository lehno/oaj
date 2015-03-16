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
		type: String,
		ref: 'Instrument'
	},
    sheetFileId: {
        type: String,
        default: '',
        required: 'Necessario informar o arquivo pdf'
    },
    musicFileId: {
        type: String,
        default: '',
        required: 'Necessario informar o arquivo de música'
    },
    user : {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Sheet', SheetSchema);
