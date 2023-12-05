var employeeModel = require('./employeeModel');
var key = '123456789trytryrtyr';
var encryptor = require('simple-encryptor')(key);

module.exports.createEmployeeDBService = (employeeDetails) => {
    return new Promise(function myFn(resolve, reject) {
        var employeeModelData = new employeeModel();
        employeeModelData.firstname = employeeDetails.firstname;
        employeeModelData.lastname = employeeDetails.lastname;
        employeeModelData.email = employeeDetails.email;
        employeeModelData.password = employeeDetails.password;
        var encrypted = encryptor.encrypt(employeeDetails.password);
        employeeModelData.password = encrypted;

        employeeModelData.save(function resultHandle(error, result) {
            if (error) {
                reject(false);
            } else {
                resolve(true);
            }
        });
    });
}

module.exports.loginEmployeeDBService = (employeeDetails) => {
    return new Promise(function myFn(resolve, reject) {
        employeeModel.findOne({ email: employeeDetails.email }, function getresult(errorvalue, result) {
            if (errorvalue) {
                reject({ status: false, msg: "Invalid" });
            } else {
                if (result != undefined && result != null) {
                    var decrypted = encryptor.decrypt(result.password);
                    if (decrypted == employeeDetails.password) {
                        resolve({ status: true, msg: "Validated" });
                    } else {
                        reject({ status: false, msg: "Validation Failed" });
                    }
                } else {
                    reject({ status: false, msg: "Error" });
                }
            }
        });
    });
}
