const mongoose = require('mongoose');
let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    taskName: String,
    assignedTo: mongoose.Schema.Types.ObjectId,
    dueDate: {
        type: Date,
        default: Date.now
    },
    taskStatus: {
        type: String,
        validate: {
            validator: function (status) {
                return status == "InProgress" || status == "Complete";
            },
            message: 'Task status should be InProgress or Complete'
        }
    },
    description: String
});
module.exports = mongoose.model('Task', taskSchema);