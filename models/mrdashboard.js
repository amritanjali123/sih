"use strict";
module.exports = (sequelize, DataTypes) => {
  const MRDashboard = sequelize.define(
    "MRDashboard",
    {
      UserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      CompId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      emp_id: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  MRDashboard.associate = function(models) {
    // MRDashboard.belongsTo(models.CompDashboard);
    // MRDashboard.belongsToMany(models.Post, { through: models.MrPost });
    // MRDashboard.belongsToMany(models.DOCDashboard, {
    //   through: models.DocMrReq,
    //   foreignKey: "MrId"
    // });

    MRDashboard.belongsTo(models.User);
    MRDashboard.belongsTo(models.User, { as: "MR", foreignKey: "CompId" });
    // MRDashboard.hasMany(models.DocMrReq, { foreignKey: "MrId" });
    // MRDashboard.belongsToMany(models.User, {
    //   as: "DocMR",
    //   through: models.DocMrReq
    // });
  };
  return MRDashboard;
};
