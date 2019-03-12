"use strict";
module.exports = (sequelize, DataTypes) => {
  const PostComment = sequelize.define(
    "PostComment",
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  PostComment.associate = function(models) {
    PostComment.belongsTo(models.Post);
  };
  return PostComment;
};
