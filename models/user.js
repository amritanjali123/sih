"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mobile: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: {
          args: true,
          msg: "Mobile number already in use"
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email already in use"
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_type: {
        type: DataTypes.ENUM,
        values: ["DOC", "MR", "COMP"],
        allowNull: false
      },
      profile: {
        type: DataTypes.STRING
      },
      cover: {
        type: DataTypes.STRING
      }
    },
    {}
  );
  User.associate = function(models) {
    User.hasOne(models.CompDashboard);
    User.hasOne(models.DOCDashboard);
    User.hasOne(models.MRDashboard);
    User.hasMany(models.Post, { as: "CompPost", foreignKey: "CompId" });
    User.hasMany(models.MRDashboard, { as: "MR", foreignKey: "CompId" });

    User.belongsToMany(models.Post, {
      through: models.DocPost,
      as: "DOCPost",
      foreignKey: "UserId"
    });
    User.belongsToMany(models.Post, {
      through: models.MrPost,
      as: "MRPost",
      foreignKey: "MrId"
    });
    User.hasMany(models.DocMrReq, { foreignKey: "MrId" });
    User.belongsToMany(models.User, {
      through: models.DocMrReq,
      as: "Mr",
      foreignKey: "MrId"
    });
  };
  return User;
};
