'use strict';
module.exports = (sequelize, DataTypes) => {
  const DocPost = sequelize.define('DocPost', {
    UserId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER
  }, {});
  DocPost.associate = function(models) {
    // associations can be defined here
  };
  return DocPost;
};