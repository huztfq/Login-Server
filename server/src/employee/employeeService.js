var employeeModel = require('./employeeModel');
var key = '123456789trytryrtyr';
var encryptor = require('simple-encryptor')(key);

module.exports.createEmployeeDBService = (employeeDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            var employeeModelData = new mployeeModel({
                firstname: employeeDetails.firstname,
                lastname: employeeDetails.lastname,
                email: employeeDetails.email,
            });

            if (employeeDetails.password) {
                var encrypted = encryptor.encrypt(employeeDetails.password);
                employeeModelData.password = encrypted;
            } else {
                reject({ error: "Password not provided" });
                return;
            }

            // Use await to wait for the save operation to complete
            await employeeModelData.save();

            resolve(true);
        } catch (error) {
            // Use reject to handle errors
            reject({ error: "Unexpected error", details: error });
        }
    });
};

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
