"use strict";
module.exports = (sequelize, DataTypes) => {
  const CompDashboard = sequelize.define(
    "CompDashboard",
    {
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
      }
    },
    {}
  );
  CompDashboard.associate = function(models) {
    CompDashboard.belongsTo(models.User);
    //CompDashboard.hasMany(models.MRDashboard, { foreignKey: "CompId" });
    //CompDashboard.hasMany(models.Post);
  };
  return CompDashboard;
};
