var mongoose = require('mongoose');

// userSchema
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    username: {
        type: String,
        required: true,
        unique: true // Ensure username is unique
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    admin: {
        type: Number,
        default: 0 
    },
  
    address: {
        street: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        state: {
            type: String,
            required: false
        },
        postalCode: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        }
    },
    profilePicture: {
        type: String,
        required: false
    },
    roles: {
        type: [String],
        default: ['user']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var User = mongoose.model('User', userSchema);
module.exports = User;
