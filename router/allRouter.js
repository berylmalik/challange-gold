const express = require("express");
const allRouter = express.Router();

//Note: Variable tidak terpakai bisa dihapus saja
const users = require("../database/users.json");
const { formatResponse } = require("../helpers/formatResponse.js");
const { UserController, ProductController } = require("../handler/controller.js");
const fs = require("fs");

allRouter.route("").get(UserController.getIndexPage);

allRouter
    .route("/home/update-profile")
    .get(UserController.getUpdatePage)
    .patch(UserController.updateProfile);

allRouter.route("/register").get(UserController.getRegisterPage).post(UserController.createId);

allRouter.route("/login").get(UserController.getLoginPage).post(UserController.loginById);

allRouter.route("/home").get(UserController.getIHomePage).post(ProductController.productPlusMin);

allRouter
    .route("/home/settings")
    .get(UserController.getSettingsPage)
    .post(ProductController.productPlusMin)
    .delete(UserController.deleteAccount);

allRouter.route("/settings/deletedAccount").get(UserController.getDeletedAccountPage);

allRouter.route("/home/cart").get(UserController.getCartPage).post(ProductController.paymentStatus);
allRouter.route("/home/pay").get(UserController.getPayPage).post(ProductController.pushShipment);
module.exports = { allRouter };
