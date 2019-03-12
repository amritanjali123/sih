"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("DownVotes", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        UserId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        PostId: {
          type: Sequelize.INTEGER,
          allowNull: false
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
          "ALTER TABLE `DownVotes` ADD UNIQUE `unique_index`(`PostId`, `UserId`)"
        );
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("DownVotes");
  }
};
