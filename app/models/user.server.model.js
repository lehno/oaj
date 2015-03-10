'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Preencha seu nome completo']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Preencha seu email'],
        match: [/.+\@.+\..+/, 'Preencha um email valido']
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Senha precisa ser maior']
    },
    instrument: {
        type: Schema.ObjectId,
        ref: 'Instrument'
    },
    salt: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.pre('save', function (next) {
    var self = this;
    mongoose.model('User').findOne({email: this.email}, 'email', function (err, results) {
        if (err) {
            next(err);
        } else if (results) {
            self.invalidate('email', 'Email já existente');
            next();
        } else {
            next();
        }
    });
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);
