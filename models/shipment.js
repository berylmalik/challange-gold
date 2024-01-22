"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Shipment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Shipment.belongsTo(models.User, {
                foreignKey: "user_id",
                sourceKey: "user_id",
            });
            Shipment.belongsTo(models.Order, {
                foreignKey: "order_id",
                sourceKey: "order_id",
            });
        }
    }
    Shipment.init(
        {
            shipment_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: DataTypes.INTEGER,
            order_id: DataTypes.INTEGER,
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
            modelName: "Shipment",
            tableName: "Shipments",
            paranoid: true,
            underscored: true,
        }
    );
    return Shipment;
};
