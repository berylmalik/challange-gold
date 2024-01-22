"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Products", {
            product_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            item: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            price: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            stock_quantity: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            created_at: {
                type: Sequelize.DATE,
            },
            updated_at: {
                type: Sequelize.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Products");
    },
};
