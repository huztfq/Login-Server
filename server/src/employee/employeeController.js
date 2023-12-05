// Correct the require statement to use employeeService
var employeeService = require('./employeeService');

var createEmployeeControllerFn = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        // Check if req.body is empty
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).send({ "status": false, "message": "Request body is empty or missing required fields" });
            return;
        }

        var status = await employeeService.createEmployeeDBService(req.body);
        console.log("createEmployeeDBService Status:", status);

        if (status) {
            res.send({ "status": true, "message": "Creation successfully" });
        } else {
            res.send({ "status": false, "message": "Error while creating" });
        }
    } catch (err) {
        console.error("Error in createEmployeeControllerFn:", err);
        res.status(500).send({ "status": false, "message": "Internal Server Error" });
    }
}

var loginUserControllerFn = async (req, res) => {
    var result = null;
    try {
        result = await employeeService.loginEmployeeDBService(req.body);
        if (result.status) {
            res.send({ "status": true, "message": result.msg });
        } else {
            res.send({ "status": false, "message": result.msg });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ "status": false, "message": "Internal Server Error" });
    }
}

module.exports = { createEmployeeControllerFn, loginUserControllerFn };
