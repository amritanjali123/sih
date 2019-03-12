"use strict";
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("DocMrReqs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      MrId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      DocId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      approve: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      decline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).then(function() {
      return queryInterface.sequelize.query(
        'ALTER TABLE `DocMrReqs` ADD UNIQUE `unique_index`(`DocId`, `MrId`)'
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("DocMrReqs");
  }
};
