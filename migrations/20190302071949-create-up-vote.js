"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("UpVotes", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        UserId: {
          type: Sequelize.INTEGER
        },
        PostId: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(function() {
        return queryInterface.sequelize.query(
          "ALTER TABLE `UpVotes` ADD UNIQUE `unique_index`(`PostId`, `UserId`)"
        );
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("UpVotes");
  }
};
