"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order.hasOne(models.User, {
                foreignKey: "user_id",
                sourceKey: "user_id",
            });
            Order.hasMany(models.Product, {
                foreignKey: "product_id",
                sourceKey: "product_id",
            });
        }
    }
    Order.init(
        {
            order_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: DataTypes.INTEGER,
            product_id: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            total_item_price: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            order_status: DataTypes.STRING,
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
                defaultValue: new Date(),
            },
        },
        {
            sequelize,
            modelName: "Order",
            tableName: "Orders",
            paranoid: true,
            underscored: true,
        }
    );
    return Order;
};
