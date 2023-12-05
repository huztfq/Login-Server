const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    }
});

const EmployeeModel = mongoose.model('Employee', employeeSchema);

module.exports = EmployeeModel;
