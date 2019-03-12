"use strict";
module.exports = (sequelize, DataTypes) => {
  const DownVote = sequelize.define(
    "DownVote",
    {
      UserId: DataTypes.INTEGER,
      PostId: DataTypes.INTEGER
    },
    {}
  );
  DownVote.associate = function(models) {
    DownVote.belongsTo(models.Post);
  };
  return DownVote;
};
