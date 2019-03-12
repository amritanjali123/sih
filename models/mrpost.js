"use strict";
module.exports = (sequelize, DataTypes) => {
  const MrPost = sequelize.define(
    "MrPost",
    {
      MrId: {
        type: DataTypes.INTEGER
      },
      PostId: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  MrPost.associate = function(models) {};
  return MrPost;
};
