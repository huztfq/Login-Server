var express = require('express');  
var employeeController = require('../src/employee/employeeController'); 
const router = express.Router();

router.route('/user/login').post(employeeController.loginUserControllerFn);
router.route('/user/create').post(employeeController.createEmployeeControllerFn);

module.exports = router;
