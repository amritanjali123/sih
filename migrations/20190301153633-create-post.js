"use strict";
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("Posts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      CompId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      therapeutic_indication: {
        type: DataTypes.ENUM,
        values: ["Allergies", "Tolerants"],
        allowNull: true
      },
      warning: {
        type: DataTypes.STRING,
        allowNull: true
      },
      side_effects: {
        type: DataTypes.JSON,
        allowNull: false
      },
      composition: {
        type: DataTypes.JSON,
        allowNull: false
      },
      overdose: {
        type: DataTypes.STRING,
        allowNull: false
      },
      precaution: {
        type: DataTypes.STRING,
        allowNull: false
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      upVote: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      downVote: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    return queryInterface.dropTable("Posts");
  }
};
