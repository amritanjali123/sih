"use strict";
module.exports = (sequelize, DataTypes) => {
  const DOCDashboard = sequelize.define(
    "DOCDashboard",
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          args: true,
          msg: "Dashboard already created"
        }
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
      }
    },
    {}
  );
  DOCDashboard.associate = function(models) {
    DOCDashboard.belongsTo(models.User);
    DOCDashboard.belongsToMany(models.MRDashboard, {
      through: models.DocMrReq,
      foreignKey: "DocId"
    });
  };
  return DOCDashboard;
};
