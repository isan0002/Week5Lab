const mongoose = require('mongoose');
let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: String,
    },
    level:{
        type: String,
        required: true,
        validate: {
            validator: function (level) {
                return level == "BEGINNER" || level == "EXPERT";
            },
            message: 'Level must be BEGINNER or EXPERT'
        }
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: Number,
    }
});
module.exports = mongoose.model('Developer', developerSchema);