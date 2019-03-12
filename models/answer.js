"use strict";
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    "Answer",
    {
      Answer: {
        type: DataTypes.STRING,
        allowNull: false
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      PublicPostId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Answer.associate = function(models) {
    Answer.belongsTo(models.PublicPost);
  };
  return Answer;
};
