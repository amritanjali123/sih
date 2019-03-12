"use strict";
module.exports = (sequelize, DataTypes) => {
  const DocMrReq = sequelize.define(
    "DocMrReq",
    {
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
      }
    },
    {}
  );
  DocMrReq.associate = function(models) {
    DocMrReq.belongsTo(models.User, { as: "Doctor", foreignKey: "DocId" });
    DocMrReq.belongsTo(models.User, { as: "MR", foreignKey: "MrId" });
  };
  return DocMrReq;
};
