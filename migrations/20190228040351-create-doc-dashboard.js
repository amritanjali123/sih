"use strict";
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("DOCDashboards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      specialization: {
        type: DataTypes.STRING
      },
      qualification: {
        type: DataTypes.STRING,
        allowNull: false
      },
      current_location: {
        type: DataTypes.STRING
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
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable("DOCDashboards");
  }
};
