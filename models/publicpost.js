"use strict";
module.exports = (sequelize, DataTypes) => {
  const PublicPost = sequelize.define(
    "PublicPost",
    {
      Question: DataTypes.STRING
    },
    {}
  );
  PublicPost.associate = function(models) {
    PublicPost.hasMany(models.Answer);
  };
  return PublicPost;
};
