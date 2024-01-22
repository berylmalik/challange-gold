const { Cookie } = require("express-session");
const { formatResponse } = require("../helpers/formatResponse");
const { User, Product, Order, Shipment } = require("../models");

class UserController {
    static getIndexPage(req, res) {
        req.session.destroy();
        res.clearCookie("Cookie");
        return res.status(200).render("index");
    }
    static getLoginPage(req, res) {
        return res.status(200).render("login");
    }
    static getIHomePage(req, res) {
        let username = req.session.userData.name;
        return res.status(200).render("home", { username });
    }
    static getRegisterPage(req, res) {
        return res.status(200).render("register");
    }
    static getDeletedAccountPage(req, res) {
        return res.status(200).render("deletedAccount");
    }
    static getSettingsPage(req, res) {
        return res.status(200).render("settings");
    }
    static async getCartPage(req, res) {
        let { seeOrder, totalSum, orderedItem } = await ProductController.getTotalPrice(
            req.session.userData.user_id
        );
        console.log(seeOrder, "<<<<<< SeeOrder");
        console.log(totalSum, "<<<<<<< totalSum");
        return res.status(200).render("cart", { seeOrder, totalSum });
    }
    static getPayPage(req, res) {
        return res.status(200).render("pay");
    }

    static async loginById(req, res) {
        try {
            // Checking user account to database
            let { email, password } = req.body;
            let foundUser = await User.findOne({
                attributes: ["user_id", "name", "email", "address"],
                where: {
                    email: email,
                    password: password,
                },
            });
            // Putting logged in user account to session
            if (foundUser) {
                req.session.authenticated = true;
                req.session.userData = foundUser;

                console.log(formatResponse(req.session.userData));
                res.status(200).redirect("/home");
            } else {
                console.log(formatResponse(req.body, "Id not found"));
                return res.status(401);
            }
        } catch (error) {
            console.error("Error during login", error);
            return res.status(500).send("Internal Server Error)");
        }
    }

    static async createId(req, res) {
        try {
            let { email, name, password, address } = req.body;

            // Checking email in database
            let checkEmail = await User.findOne({
                attributes: ["email"],
                where: {
                    email: email,
                },
                paranoid: false,
            });

            if (checkEmail) {
                console.log(formatResponse(email, "Email already exist."));
                return res.status(403).send("Email already exist.");
            }

            // Validate email format
            let isCorrectEmail = email.includes("@");
            if (!isCorrectEmail) {
                console.log(formatResponse(email, "Email does not includes @"));
                return res.status(403).send("Email does not includes @");
            }

            // Check password format
            let isCorrectPassword = false;
            if (password.length < 8) {
                isCorrectPassword = false;
            } else if (!/[A-Z/]/.test(password)) {
                isCorrectPassword = false;
            } else if (!/[a-z]/.test(password)) {
                isCorrectPassword = false;
            } else if (!/[0-9]/.test(password)) {
                isCorrectPassword = false;
            } else if (!/[@$!%*#?&]/.test(password)) {
                isCorrectPassword = false;
            } else {
                isCorrectPassword = true;
            }

            if (isCorrectPassword === false) {
                console.log(formatResponse(password, "Password is not strong enough."));
                return res.status(403).redirect("/register");
            }

            // Creating new user in database
            if (!checkEmail && isCorrectPassword === true) {
                let newUser = await User.create({
                    name: name,
                    email: email,
                    password: password,
                    address: address,
                });

                console.log(formatResponse(newUser, "User account created successfully."));
                return res.status(201).redirect("/login");
            }
        } catch (error) {
            console.error("Error during register", error);
            return res.status(500).send("Internal Server Error)");
        }
    }

    static async deleteAccount(req, res) {
        try {
            // Finding user by ID
            let findId = await User.findByPk(req.session.userData.user_id);

            if (!findId) {
                console.log(formatResponse(req.session.userData, "Id not found!"));
                return res.status(404);
            }

            // Deleting user account
            await findId.destroy();

            console.log(formatResponse(findId, "Your account has been deleted."));
            req.session.destroy();
            res.clearCookie("Cookie");

            return res.status(200);
        } catch (error) {
            console.error("Error during deleting account", error);
            return res.status(500).send("Internal Server Error)");
        }
    }
}

class ProductController extends UserController {
    static async productPlusMin(req, res) {
        try {
            let { method, id } = req.body;
            console.log(req.body);

            // Creating or finding order by user_id from session and product_id from HTML
            let userId = req.session.userData.user_id;
            let product = await Product.findByPk(id);

            let order = await Order.findOne({
                where: {
                    user_id: userId,
                    product_id: id,
                    order_status: "pending",
                },
                include: [
                    {
                        model: Product,
                        attributes: ["item", "price"],
                    },
                ],
            });

            //Plus method for generating increment in order.quantity
            if (method === "plus") {
                if (!order) {
                    await Order.create({
                        user_id: userId,
                        product_id: id,
                        quantity: 1,
                        total_item_price: product.price,
                        order_status: "pending",
                        created_at: new Date(),
                        updated_at: new Date(),
                        deleted_at: null,
                    });
                    console.log(formatResponse(product.item, "Order created, total 1"));
                    return res.status(200);
                } else if (product.stock_quantity > 0) {
                    order.quantity++;
                    product.stock_quantity--;
                    order.total_item_price += product.price;

                    await product.save();
                    await order.save();
                    console.log(
                        formatResponse(product.item, `Added 1 quantity, total ${order.quantity}`)
                    );
                    return res.status(200);
                } else if (product.stock_quantity === 0) {
                    console.log(formatResponse(product, "Product is sold out."));
                    return res.status(400);
                }

                //Min method for generating decrement in order.quantity
            } else if (method === "min") {
                if (!order) {
                    console.log(formatResponse(product, "Order is empty."));
                } else if (order.quantity > 0) {
                    order.quantity--;
                    product.stock_quantity++;
                    order.total_item_price -= product.price;

                    console.log(
                        formatResponse(
                            product.item,
                            `Substracted 1 quantity, total ${order.quantity}`
                        )
                    );
                    await product.save();
                    await order.save();
                    return res.status(200);
                } else if (order.quantity === 0) {
                    // await order.destroy();
                    console.log(formatResponse(product, "Ordered product is null"));
                    return res.status(400);
                }
            } else {
                console.log("Invalid method.");
                return res.status(400).send("Invalid method.");
            }
        } catch (error) {
            console.error("Error during deleting account", error);
            return res.status(500).send("Internal Server Error)");
        }
    }

    static async getTotalPrice(id) {
        const orderedItem = await Order.findAll({
            where: [
                {
                    order_status: "pending",
                },
            ],
            attributes: ["order_id", "quantity", "total_item_price", "order_status"],
            include: [
                {
                    model: User,
                    attributes: ["user_id"],
                    where: {
                        user_id: id,
                    },
                },
                {
                    model: Product,
                    attributes: ["item", "price"],
                },
            ],
            raw: false,
        });
        let seeOrder = JSON.stringify(orderedItem);
        let totalSum = orderedItem.reduce(
            (accumulator, currentItem) => accumulator + currentItem.total_item_price,
            0
        );
        return { seeOrder, totalSum, orderedItem };
    }

    //** if paymentStatus failed, please try a few times! needs more development */
    static async paymentStatus(req, res) {
        try {
            // Changing order status from "pending" to "shipped/cancelled"
            let userId = req.session.userData.user_id;
            let { seeOrder, orderedItem } = await ProductController.getTotalPrice(userId);

            for (let order of orderedItem) {
                let changeStatus = await Order.findByPk(order.order_id);

                if (order.quantity > 0) {
                    changeStatus.order_status = "shipped";
                    await changeStatus.save();
                } else if (order.quantity === 0) {
                    changeStatus.order_status = "cancelled";
                    await changeStatus.save();
                }
            }
            // await ProductController.pushShipment();
            console.log(formatResponse(seeOrder, "Orders processed successfully"));
            res.status(200);
        } catch (error) {
            console.error("Error during changing status", error);
            return res.status(500).send("Internal Server Error");
        }
    }

    // static async paymentStatus(req, res) {
    //     try {
    //         // Changing order status from "pending" to "shipped/cancelled"
    //         let userId = req.session.userData.user_id;
    //         let { seeOrder, orderedItem } = await ProductController.getTotalPrice(userId);

    //         const promises = orderedItem.map(async (order) => {
    //             let changeStatus = await Order.findByPk(order.order_id);
    //             console.log(changeStatus, "INII CHANGESTATUS");
    //             if (!changeStatus) {
    //                 console.error(`Order ${order.order_id} not found`);
    //                 return; // Skip to the next iteration if order not found
    //             }

    //             if (order.quantity > 0) {
    //                 changeStatus.order_status = "shipped";
    //                 await changeStatus.save();
    //                 console.log(`Order ${order.order_id} status changed to "shipped"`);

    //                 // Push shipped order to table Shipments (if needed)
    //             } else if (order.quantity === 0) {
    //                 changeStatus.order_status = "cancelled";
    //                 await changeStatus.save();
    //                 console.log(`Order ${order.order_id} status changed to "cancelled"`);
    //             } else {
    //                 console.error(`Can't process order ${order.order_id}`);
    //             }
    //         });

    //         await Promise.all(promises);

    //         // Now, you can call pushShipment if needed
    //         await ProductController.pushShipment(req, res);

    //         console.log(formatResponse(seeOrder, "Orders processed successfully"));
    //         res.status(200).send("Orders processed successfully");
    //     } catch (error) {
    //         console.error("Error during changing status", error);
    //         return res.status(500).send("Internal Server Error");
    //     }
    // }
    static async pushShipment(req, res) {
        let userId = req.session.userData.user_id;
        let orders = await Order.findAll({
            where: {
                user_id: userId,
            },
        });
        if (!orders) {
            console.log(orders, "<<<< DATA IS NOT THERE");
        } else if (orders) {
            for (let order of orders) {
                let shipmentData = {
                    user_id: order.user_id,
                    order_id: order.order_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                    deleted_at: null,
                };
                await Shipment.create(shipmentData);
            }
        }
    }
}
module.exports = { UserController, ProductController };
