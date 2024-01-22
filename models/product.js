"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Product.init(
        {
            product_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            item: DataTypes.STRING,
            price: DataTypes.INTEGER,
            stock_quantity: DataTypes.INTEGER,
            created_at: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            deleted_at: {
                type: DataTypes.DATE,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "Product",
            tableName: "Products",
            paranoid: true,
            underscored: true,
        }
    );
    return Product;
};
