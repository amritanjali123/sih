"use strict";
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      CompId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Item Already Available"
        }
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      therapeutic_indication: {
        type: DataTypes.STRING,
        allowNull: true
      },
      warning: {
        type: DataTypes.STRING,
        allowNull: true
      },
      side_effects: {
        type: DataTypes.JSON,
        allowNull: false
      },
      composition: {
        type: DataTypes.JSON,
        allowNull: false
      },
      overdose: {
        type: DataTypes.STRING,
        allowNull: false
      },
      precaution: {
        type: DataTypes.STRING,
        allowNull: false
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      upVote: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      downVote: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {}
  );
  Post.associate = function(models) {
    Post.belongsTo(models.User, { as: "CompPost", foreignKey: "CompId" });
    Post.hasOne(models.UpVote);
    Post.hasOne(models.DownVote);
    Post.hasMany(models.PostComment);
    Post.belongsToMany(models.User, {
      as: "MrPosts",
      through: models.MrPost,
      foreignKey: "PostId"
    });
    Post.belongsToMany(models.User, {
      through: models.DocPost,
      as: "DocPosts",
      foreignKey: "PostId"
    });
  };
  return Post;
};
