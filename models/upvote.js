"use strict";
module.exports = (sequelize, DataTypes) => {
  const UpVote = sequelize.define(
    "UpVote",
    {
      UserId: DataTypes.INTEGER,
      PostId: DataTypes.INTEGER
    },
    {}
  );
  UpVote.associate = function(models) {
    UpVote.belongsTo(models.Post);
  };
  return UpVote;
};
