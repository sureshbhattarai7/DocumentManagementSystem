const express = require('express');
const userController = require('./../Controller/userController');
const authController = require('./../Controller/authController');
const Router = express.Router();

Router.post('/signup', authController.signup);
Router.post('/login', authController.loginUser);
Router.patch('/updatePassword', authController.updatePassword);

Router.route('/')
    .get(userController.getUsers);

Router.route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateCurrentData);

module.exports = Router;