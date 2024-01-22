"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert(
            "Products",
            [
                {
                    item: "Topi",
                    price: 1000,
                    stock_quantity: 10,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    item: "Baju",
                    price: 2000,
                    stock_quantity: 8,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    item: "Celana",
                    price: 3000,
                    stock_quantity: 6,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    item: "Jaket",
                    price: 4000,
                    stock_quantity: 4,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    item: "Sepatu",
                    price: 5000,
                    stock_quantity: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
