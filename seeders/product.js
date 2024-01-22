 const { Product } = require("../models");

        Product.create({
            item: "Topi",
            price: 1000,
            quantity: 5,
        })
            .then((result) => {
                console.log(result.dataValues);
            })
            .catch((err) => {
                console.error(err);
            });