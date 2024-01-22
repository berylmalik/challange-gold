"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            address: DataTypes.STRING,
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
            modelName: "User",
            tableName: "Users",
            paranoid: true,
            underscored: true,
        }
    );
    return User;
};
