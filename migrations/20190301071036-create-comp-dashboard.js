"use strict";
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("CompDashboards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comp_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      comp_doc: {
        type: DataTypes.STRING,
        allowNull: true
      },
      din: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location: {
        type: DataTypes.JSON,
        allowNull: true
      },
      contacts: {
        type: DataTypes.JSON,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("CompDashboards");
  }
};
