"use strict";
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      Sender: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Receiver: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  Message.associate = function(models) {
    Message.belongsTo(models.User);
  };
  return Message;
};
