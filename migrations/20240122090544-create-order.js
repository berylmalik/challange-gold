"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Orders", {
            order_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    key: "user_id",
                    model: "Users",
                },
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    key: "product_id",
                    model: "Products",
                },
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            total_item_price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            order_status: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Orders");
    },
};
