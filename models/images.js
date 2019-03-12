"use strict";
module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define(
    "Images",
    {
      ImageName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Images.associate = function(models) {
    Images.belongsTo(models.Post);
  };
  return Images;
};
